import React, { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { useSearchParams } from 'react-router-dom';
import { getItems } from '../lib/supabase';
import { DualRangeSlider } from '../components/ui/dual-range-slider';

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
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
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
        setError(error instanceof Error ? error.message : "We couldn't load these items — please try again.");
      } finally {
        setLoading(false);
        setHasLoadedOnce(true);
      }
    }
    fetchItems();
  }, [searchParams, priceRange]);

  // Only replace the whole page with a skeleton on the very first load.
  // Re-fetching after a price range tweak must not unmount the filter UI --
  // that would yank the slider out from under the user mid-drag, and if a
  // narrower range matches zero items, it would also remove their only way
  // to widen the range back.
  if (loading && !hasLoadedOnce) {
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
            <DualRangeSlider min={0} max={500} value={priceRange} onChange={setPriceRange} />
          </div>
        </div>

        {error ? (
          <div className="text-center text-red-500 py-16">
            <p className="text-xl font-semibold">Error loading items</p>
            <p className="mt-2">{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl font-semibold text-gray-600">No items match this price range</p>
            <p className="mt-2 text-gray-500">Try widening the range above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
