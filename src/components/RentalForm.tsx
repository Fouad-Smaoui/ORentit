import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Button } from './ui/button';
import { DateRange, Range } from 'react-date-range';
import { addDays, isWithinInterval, parse, format } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useNavigate } from 'react-router-dom';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface RentalFormProps {
  itemId: string;
  pricePerDay: number;
  onSuccess: () => void;
  onCancel: () => void;
  availableStartDate: string;
  availableEndDate: string;
  itemName: string;
}

export function RentalForm({ 
  itemId, 
  pricePerDay, 
  onSuccess, 
  onCancel,
  availableStartDate,
  availableEndDate,
  itemName
}: RentalFormProps) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(availableStartDate),
    endDate: new Date(availableStartDate),
    key: 'selection'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateTotalPrice = () => {
    if (!dateRange.startDate || !dateRange.endDate) return 0;
    const days = Math.ceil(
      (dateRange.endDate.getTime() - dateRange.startDate.getTime()) / (1000 * 60 * 60 * 24)
    ) + 1;
    return days * pricePerDay;
  };

  const handleDateChange = (ranges: any) => {
    const { startDate, endDate } = ranges.selection;
    
    // Clear any previous errors
    setError(null);

    // Convert available dates to Date objects for comparison
    const availableStart = new Date(availableStartDate);
    const availableEnd = new Date(availableEndDate);

    // Reset time parts to midnight for accurate comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    availableStart.setHours(0, 0, 0, 0);
    availableEnd.setHours(0, 0, 0, 0);

    // Validate if selected dates are within available range
    if (startDate < availableStart || endDate > availableEnd) {
      setError('Selected dates must be within the available range');
      return;
    }

    // Validate that end date is not before start date
    if (endDate < startDate) {
      setError('End date cannot be before start date');
      return;
    }

    // If all validations pass, update the date range
    setDateRange(ranges.selection);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Format dates for the query
      const formattedStartDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(dateRange.endDate, 'yyyy-MM-dd');

      // Check if there are any overlapping bookings
      const { data: existingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('item_id', itemId)
        .neq('status', 'cancelled')
        .or(
          `and(start_date.lte.${formattedEndDate},end_date.gte.${formattedStartDate})`
        );

      if (bookingsError) {
        console.error('Booking check error:', bookingsError);
        throw new Error('Failed to check date availability');
      }

      if (existingBookings && existingBookings.length > 0) {
        throw new Error('These dates are not available. Please select different dates.');
      }

      // Store rental data in localStorage for checkout
      const rentalData = {
        itemId,
        itemName,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        totalPrice: calculateTotalPrice(),
        pricePerDay
      };
      localStorage.setItem('pendingRental', JSON.stringify(rentalData));

      // Close the modal and navigate to checkout
      onSuccess();
      navigate('/checkout');
    } catch (err) {
      console.error('Rental submission error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <DateRange
          ranges={[dateRange]}
          onChange={handleDateChange}
          minDate={new Date(availableStartDate)}
          maxDate={new Date(availableEndDate)}
          months={1}
          direction="vertical"
          className="w-full"
          rangeColors={['#a100ff']}
          showDateDisplay={true}
          showMonthAndYearPickers={true}
          showPreview={true}
          disabledDates={[]}
          dateDisplayFormat="MM/dd/yyyy"
        />
      </div>

      <div className="text-lg font-semibold">
        Total Price: ${calculateTotalPrice().toFixed(2)}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !dateRange.startDate || !dateRange.endDate}
          className={`px-4 py-2 bg-[#a100ff] text-white rounded-lg 
            ${(loading || !dateRange.startDate || !dateRange.endDate) 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:bg-opacity-90'}`}
        >
          {loading ? 'Processing...' : 'Continue to Checkout'}
        </button>
      </div>
    </form>
  );
} 