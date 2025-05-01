import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import stripePromise from '../lib/stripe';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

interface PaymentFormProps {
  clientSecret: string;
  bookingId: string;
  amount: number;
  onSuccess: () => void;
  bookingDetails: any;
}

function PaymentForm({ clientSecret, bookingId, amount, onSuccess, bookingDetails }: PaymentFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );

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
    <div className="max-w-6xl mx-auto px-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>
      
      <h1 className="text-2xl font-bold mb-8">Secure Payment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Item:</span>
              <span>{bookingDetails.items.title}</span>
            </div>
            <div className="flex justify-between">
              <span>Dates:</span>
              <span>
                {format(new Date(bookingDetails.start_date), 'MM/dd/yyyy')} - {format(new Date(bookingDetails.end_date), 'MM/dd/yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Price per day:</span>
              <span>${bookingDetails.items.price_per_day.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-4">
              <span>Total Amount:</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-6">Payment Details</h2>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">Total Amount: ${amount.toFixed(2)}</p>
              
              <div className="text-sm text-gray-600 mb-4">
                <p className="font-medium mb-2">Test Card Numbers:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Success: 4242 4242 4242 4242</li>
                  <li>Decline: 4000 0000 0000 0002</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <CardElement options={CARD_ELEMENT_OPTIONS} />
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!stripe || processing}
              className={`w-full py-3 px-4 bg-[#a100ff] text-white rounded-lg font-medium
                ${(!stripe || processing) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
            >
              {processing ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const navigate = useNavigate();
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
    <Elements stripe={stripePromise} options={{ 
      clientSecret,
      appearance: {
        theme: 'stripe',
        variables: {
          colorPrimary: '#a100ff',
        },
      },
    }}>
      <div className="min-h-screen bg-gray-50 py-12">
        <PaymentForm
          clientSecret={clientSecret}
          bookingId={bookingId!}
          amount={bookingDetails.total_price}
          onSuccess={handlePaymentSuccess}
          bookingDetails={bookingDetails}
        />
      </div>
    </Elements>
  );
} 