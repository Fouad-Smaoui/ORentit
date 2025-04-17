import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { MapPin, Calendar, User } from 'lucide-react';
import { Button } from '../components/ui/button';

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
  photos: string[];
  owner_id: string;
  created_at: string;
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
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);

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

        // Ensure photos is an array
        const processedData = {
          ...data,
          photos: Array.isArray(data.photos) ? data.photos : []
        };

        setItem(processedData as Item);
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
                  src={item.photos[selectedImage] || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop'}
                  alt={item.name}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {item.photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`${item.name} thumbnail ${index + 1}`}
                      onError={handleImageError}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Item Details */}
            <div className="space-y-6 p-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{item.name}</h1>
                <div className="mt-2 flex items-center gap-2 text-gray-500">
                  <MapPin size={18} />
                  <span>{item.location}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-primary">${item.price_per_day}</p>
                  <p className="text-sm text-gray-500">per day</p>
                </div>
                <Button size="lg">
                  Rent Now
                </Button>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Description</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-4">Specifications</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User size={18} className="text-gray-400" />
                    <span className="text-gray-600">Owner: {item.profiles.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-gray-400" />
                    <span className="text-gray-600">Listed: {new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Map Toggle */}
              <div className="border-t pt-4">
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="text-primary hover:text-primary/80 flex items-center gap-2"
                >
                  <MapPin size={18} />
                  {showMap ? 'Hide Map' : 'Show Map'}
                </button>
                {showMap && (
                  <div className="mt-4 aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                    <iframe
                      title="Item location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(item.location)}`}
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 