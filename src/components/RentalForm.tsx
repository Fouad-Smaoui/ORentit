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
}

export function RentalForm({ 
  itemId, 
  pricePerDay, 
  onSuccess, 
  onCancel,
  availableStartDate,
  availableEndDate 
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
    // Clear any previous errors
    setError(null);
    
    const { startDate, endDate } = ranges.selection;
    const availableStart = new Date(availableStartDate);
    const availableEnd = new Date(availableEndDate);

    // Validate if selected dates are within available range
    if (startDate < availableStart || endDate > availableEnd) {
      setError('Selected dates must be within the available range');
      return;
    }

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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('You must be logged in to rent an item');

      // Check if there are any overlapping bookings
      const { data: existingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('item_id', itemId)
        .or(`start_date.lte.${format(dateRange.endDate, 'yyyy-MM-dd')},end_date.gte.${format(dateRange.startDate, 'yyyy-MM-dd')}`)
        .not('status', 'eq', 'cancelled');

      if (bookingsError) throw bookingsError;
      if (existingBookings && existingBookings.length > 0) {
        throw new Error('These dates are not available. Please select different dates.');
      }

      // Create the booking
      const { data: booking, error: insertError } = await supabase
        .from('bookings')
        .insert({
          item_id: itemId,
          renter_id: user.id,
          start_date: format(dateRange.startDate, 'yyyy-MM-dd'),
          end_date: format(dateRange.endDate, 'yyyy-MM-dd'),
          total_price: calculateTotalPrice(),
          status: 'pending'
        })
        .select()
        .single();

      if (insertError) throw insertError;
      if (!booking) throw new Error('Failed to create booking');

      // Close the modal
      onSuccess();
      
      // Navigate to payment page
      navigate(`/payment/${booking.id}`, {
        state: { amount: booking.total_price }
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
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
          rangeColors={['#6366f1']} // primary color
          showDateDisplay={true}
          showMonthAndYearPickers={true}
          showPreview={true}
        />
      </div>

      <div className="text-lg font-semibold">
        Total Price: ${calculateTotalPrice().toFixed(2)}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !dateRange.startDate || !dateRange.endDate}
        >
          {loading ? 'Processing...' : 'Confirm Rental'}
        </Button>
      </div>
    </form>
  );
} 