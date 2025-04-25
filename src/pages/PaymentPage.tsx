import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { supabase } from '../lib/supabase';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface PaymentFormProps {
  clientSecret: string;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

function PaymentForm({ clientSecret, bookingId, amount, onSuccess }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Update payment record in Supabase
        const { error: dbError } = await supabase
          .from('payments')
          .update({
            status: 'completed',
            payment_method: paymentIntent.payment_method,
            updated_at: new Date().toISOString(),
          })
          .eq('payment_intent_id', paymentIntent.id);

        if (dbError) {
          console.error('Error updating payment record:', dbError);
          setError('Payment successful but failed to update records');
          return;
        }

        // Update booking status
        const { error: bookingError } = await supabase
          .from('bookings')
          .update({ status: 'confirmed' })
          .eq('id', bookingId);

        if (bookingError) {
          console.error('Error updating booking status:', bookingError);
          setError('Payment successful but failed to update booking');
          return;
        }

        onSuccess();
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
          <p className="text-gray-600">Total Amount: ${amount.toFixed(2)}</p>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-4">
            Test Card Numbers:
            <ul className="list-disc list-inside mt-2">
              <li>Success: 4242 4242 4242 4242</li>
              <li>Decline: 4000 0000 0000 0002</li>
            </ul>
          </div>
          <PaymentElement />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || processing}
          className={`w-full mt-6 py-3 px-4 bg-[#a100ff] text-white rounded-lg font-medium
            ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { bookingId } = useParams<{ bookingId: string }>();

  useEffect(() => {
    async function initializePayment() {
      if (!bookingId) {
        setError('No booking ID provided');
        return;
      }

      try {
        // Get booking details
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            *,
            items (
              title,
              price_per_day
            )
          `)
          .eq('id', bookingId)
          .single();

        if (bookingError || !booking) {
          throw new Error(bookingError?.message || 'Booking not found');
        }

        setBookingDetails(booking);

        // Create payment intent
        const { data: { session } } = await supabase.auth.getSession();
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({
              amount: booking.total_price * 100, // Convert to cents
              bookingId: booking.id,
              itemId: booking.item_id,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment intent');
        }

        const { clientSecret, paymentIntentId } = await response.json();

        // Create payment record
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: booking.renter_id,
            item_id: booking.item_id,
            booking_id: booking.id,
            amount: booking.total_price,
            status: 'pending',
            payment_intent_id: paymentIntentId,
            currency: 'USD'
          });

        if (paymentError) {
          console.error('Payment record creation error:', paymentError);
          throw new Error('Failed to create payment record');
        }

        // Only set client secret if payment record was created successfully
        setClientSecret(clientSecret);
      } catch (err) {
        console.error('Payment initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    }

    initializePayment();
  }, [bookingId]);

  const handlePaymentSuccess = () => {
    navigate('/payment-success', {
      state: { bookingId }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a100ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Payment Error</p>
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret || !bookingDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 text-gray-600 hover:text-gray-800"
            >
              ← Back
            </button>
            <h1 className="text-xl font-semibold">Secure Payment</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Item:</span>
                <span className="font-medium">{bookingDetails.items.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dates:</span>
                <span className="font-medium">
                  {new Date(bookingDetails.start_date).toLocaleDateString()} - {new Date(bookingDetails.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price per day:</span>
                <span className="font-medium">${bookingDetails.items.price_per_day.toFixed(2)}</span>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-semibold">${bookingDetails.total_price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'stripe',
                variables: {
                  colorPrimary: '#a100ff',
                },
              },
            }}
          >
            <PaymentForm
              clientSecret={clientSecret}
              bookingId={bookingId!}
              amount={bookingDetails.total_price}
              onSuccess={handlePaymentSuccess}
            />
          </Elements>
        </div>
      </div>
    </div>
  );
} 