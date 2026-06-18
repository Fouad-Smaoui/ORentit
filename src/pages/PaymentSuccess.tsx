import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const location = useLocation();
  const bookingId = (location.state as { bookingId?: string } | null)?.bookingId;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
        <p className="text-gray-600 mb-6">
          Your booking is confirmed. The owner will be in touch with you shortly.
        </p>
        {bookingId && (
          <p className="text-sm text-gray-400 mb-6">Booking reference: {bookingId}</p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full py-2 px-4 bg-[#a100ff] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/items"
            className="w-full py-2 px-4 text-[#a100ff] border border-[#a100ff] rounded-lg hover:bg-purple-50 transition-colors"
          >
            Browse More Items
          </Link>
        </div>
      </div>
    </div>
  );
}
