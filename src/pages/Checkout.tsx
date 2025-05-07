import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Button } from '../components/ui/button';
import { Calendar, Package, DollarSign } from 'lucide-react';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RentalData {
  itemId: string;
  itemName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  pricePerDay: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [rentalData, setRentalData] = useState<RentalData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    const storedRental = localStorage.getItem('pendingRental');
    if (!storedRental) {
      navigate('/');
      return;
    }

    setRentalData(JSON.parse(storedRental));
    checkAuth();
  }, [navigate]);

  const handleLogin = () => {
    navigate('/auth', { state: { from: '/checkout' } });
  };

  const handleContinue = async () => {
    if (!rentalData) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // For non-authenticated users, store the rental data and redirect to auth
        localStorage.setItem('pendingRental', JSON.stringify(rentalData));
        handleLogin();
        return;
      }

      // Create the booking for authenticated users
      const { data: booking, error: insertError } = await supabase
        .from('bookings')
        .insert({
          item_id: rentalData.itemId,
          renter_id: user.id,
          start_date: rentalData.startDate,
          end_date: rentalData.endDate,
          total_price: rentalData.totalPrice,
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!booking) throw new Error('Failed to create booking');

      // Clear the pending rental data
      localStorage.removeItem('pendingRental');

      // Navigate to payment page
      navigate(`/payment/${booking.id}`, {
        state: { amount: booking.total_price }
      });
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!rentalData) {
    return <div>No rental data found</div>;
  }

  const days = Math.ceil(
    (new Date(rentalData.endDate).getTime() - new Date(rentalData.startDate).getTime()) / (1000 * 60 * 60 * 24)
  ) + 1;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

            {/* Order Summary */}
            <div className="space-y-6">
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">{rentalData.itemName}</p>
                      <p className="text-sm text-gray-500">${rentalData.pricePerDay}/day</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="ml-3">
                      <p className="text-gray-900">
                        {new Date(rentalData.startDate).toLocaleDateString()} - {new Date(rentalData.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{days} days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-b pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily rate</span>
                    <span className="text-gray-900">${rentalData.pricePerDay.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Number of days</span>
                    <span className="text-gray-900">{days}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">${rentalData.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Login Prompt */}
              {!isAuthenticated && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                  <p className="text-yellow-700">
                    You'll need to create an account or sign in to complete your booking.
                  </p>
                  <button
                    onClick={handleLogin}
                    className="mt-4 w-full bg-[#a100ff] text-white py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
                  >
                    Sign in to Continue
                  </button>
                </div>
              )}

              {/* Continue Button */}
              {isAuthenticated && (
                <Button
                  onClick={handleContinue}
                  className="w-full bg-[#a100ff] hover:bg-opacity-90 text-white"
                >
                  Proceed to Payment
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 