import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { useSearchParams } from 'react-router-dom';
import { getItems } from '../lib/supabase';

interface Profile {
  username: string;
  avatar_url: string | null;
}

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
  created_at: string;
  profiles: Profile;
}

export function ItemsPage() {
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        const category = searchParams.get('category');
        const [minPrice, maxPrice] = priceRange;
        const data = await getItems({
          category: category || undefined,
          minPrice,
          maxPrice,
        });
        if (data) setItems(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [searchParams, priceRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl font-semibold">Error loading items</p>
          <p className="mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-600">No items available</p>
          <p className="mt-2 text-gray-500">Check back later for new items!</p>
        </div>
      </div>
    );
  }

  const category = searchParams.get('category');
  const categoryTitle = category
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} for Rent`
    : 'Available Items';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{categoryTitle}</h1>
            <p className="mt-2 text-gray-600">Browse through our collection of items available for rent</p>
          </div>

          {/* Price Range Filter */}
          <div className="min-w-[180px] max-w-[260px] bg-white shadow-md rounded-xl p-4 mt-6 md:mt-0 md:ml-6 flex flex-col items-center transition-shadow hover:shadow-lg">
            <span className="text-sm font-semibold text-[#a100ff] mb-1">Price Range</span>
            <span className="text-sm text-gray-600 mb-3">
              ${priceRange[0]} - ${priceRange[1]}
            </span>
            <div className="w-full flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={500}
                value={priceRange[0]}
                onChange={(e) => {
                  const value = Math.min(Number(e.target.value), priceRange[1]);
                  setPriceRange([value, priceRange[1]]);
                }}
                className="w-full accent-[#a100ff]"
              />
              <input
                type="range"
                min={0}
                max={500}
                value={priceRange[1]}
                onChange={(e) => {
                  const value = Math.max(Number(e.target.value), priceRange[0]);
                  setPriceRange([priceRange[0], value]);
                }}
                className="w-full accent-[#a100ff]"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
