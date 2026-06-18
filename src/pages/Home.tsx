import React, { useEffect, useState } from 'react';
import { Search, Car, Tent } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import SemanticSearchResults from '../components/SemanticSearchResults';

// Initialize Supabase client
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
  owner_id: string;
  image_url: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const search = useSemanticSearch();

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*, profiles(username, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) {
          console.error('Error fetching items:', error);
          return;
        }

        setItems(data || []);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    search.submit();
  };

  return (
    <div>
      {/* Self-contained search panel — fits in the viewport below the navbar.
          Search bar (shrink-0) + status + results (flex-1, internal scroll only)
          so a query never requires page scroll to see its results. */}
      <div
        className="relative h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2021&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 flex flex-col h-full px-4 sm:px-6 lg:px-8">
          {/* Header + search bar — fixed at the top of the panel */}
          <div className="flex-shrink-0 max-w-3xl mx-auto w-full text-center pt-8 sm:pt-12 pb-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
              Rent Anything, <span className="text-primary-400">Anywhere</span>
            </h1>
            <p className="text-white text-base md:text-lg mb-6">
              Join our community of renters and owners. Share your items or find exactly what you need.
            </p>

            <form onSubmit={handleSearch} className="w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-6 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Describe what you're after, e.g. a relaxing beach vacation"
                  value={search.query}
                  onChange={(e) => search.setQuery(e.target.value)}
                  className="w-full pl-16 pr-32 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-[#a100ff] focus:ring-opacity-50 shadow-lg bg-white/95 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  className="absolute right-2 px-8 py-2.5 bg-[#a100ff] text-white rounded-full text-lg font-medium hover:bg-opacity-90 transition-all duration-200"
                >
                  Go!
                </Button>
              </div>
            </form>
          </div>

          {/* Status + results — fills remaining height, scrolls internally if it overflows */}
          <div className="flex-1 min-h-0 overflow-y-auto max-w-7xl mx-auto w-full pb-6">
            <SemanticSearchResults search={search} />
          </div>
        </div>
      </div>

      {search.status === 'idle' && (
        <>
          {/* Categories Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Categories</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Link to="/items?category=vehicles" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Vehicles"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Car size={48} className="mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">Vehicles</h3>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/items?category=leisure" className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-48">
                  <img
                    src="https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                    alt="Leisure"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="text-white text-center">
                      <Tent size={48} className="mx-auto mb-2" />
                      <h3 className="text-2xl font-bold">Leisure</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Featured Items Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Items</h2>
              <Link
                to="/items"
                className="text-[#a100ff] hover:text-opacity-90 font-medium flex items-center gap-2"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No items available yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
