import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { BookingModal } from '../components/BookingModal';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  price_per_day: number;
  location: string;
  location_id: string | null;
  latitude: number | null;
  longitude: number | null;
  image_url: string;
  owner_id: string;
  start_date: string;
  end_date: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export default function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  useEffect(() => {
    async function fetchItem() {
      try {
        if (!id) throw new Error('No item ID provided');

        const { data, error } = await supabase
          .from('items')
          .select(`
            *,
            profiles (
              username,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Item not found');

        setItem(data as Item);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchItem();
  }, [id]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    const fallbackUrl = `https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop`;
    if (target.src !== fallbackUrl) {
      target.src = fallbackUrl;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error loading item</p>
          <p className="mt-2">{error || 'Item not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-4">
              <div className="aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop'}
                  alt={item.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                <p className="mt-2 text-gray-500">{item.description}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-500">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{item.location}</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>Available: {formatDate(item.start_date)} - {formatDate(item.end_date)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-gray-900">${item.price_per_day}</p>
                    <p className="text-sm text-gray-500">per day</p>
                  </div>
                  <Button 
                    size="lg"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    Rent Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        itemId={item.id}
        pricePerDay={item.price_per_day}
        startDate={item.start_date}
        endDate={item.end_date}
      />
    </div>
  );
} 