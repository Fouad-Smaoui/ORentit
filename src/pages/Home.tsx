import React, { useEffect, useState } from 'react';
import { Search, Sparkles, ArrowRight, Compass } from 'lucide-react';
import { motion } from 'framer-motion';
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

interface AdventureTheme {
  title: string;
  description: string;
  query: string;
  image: string;
}

const ADVENTURE_THEMES: AdventureTheme[] = [
  {
    title: 'Winter Escapes',
    description: 'Powder days and mountain air',
    query: 'skiing and snowboarding in the mountains this winter',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=70',
  },
  {
    title: 'Nature & Wildlife',
    description: 'Get closer to the wild',
    query: 'photographing wildlife and landscapes',
    image: 'https://images.unsplash.com/photo-1758163462515-84679111e6c0?auto=format&fit=crop&w=800&q=70',
  },
  {
    title: 'Coastal Getaways',
    description: 'Sun, salt air, and slow days',
    query: 'relaxing beach vacation with warm weather',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=70',
  },
  {
    title: 'City Wandering',
    description: 'Cobblestones and hidden corners',
    query: 'exploring historic cities and museums',
    image: 'https://images.unsplash.com/photo-1714477897451-814a2f5aba8a?auto=format&fit=crop&w=800&q=70',
  },
];

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

  const handleThemeClick = (query: string) => {
    search.submitQuery(query);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <motion.div
            className="flex-shrink-0 max-w-3xl mx-auto w-full text-center pt-4 sm:pt-12 pb-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 sm:mb-3"
            >
              Your next adventure starts <span className="text-primary-400">with a sentence</span>
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:block text-white/90 text-base md:text-lg mb-6"
            >
              Skip the filters. Describe what you want to do, and our AI matches you with the gear to do it.
            </motion.p>

            <motion.form
              variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onSubmit={handleSearch}
              className="w-full"
            >
              <div className="relative flex items-center rounded-full shadow-glow focus-within:shadow-[0_0_0_3px_rgb(161,0,255,0.18),0_8px_32px_-8px_rgb(161,0,255,0.35)] transition-shadow duration-300">
                <Search className="absolute left-6 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Try: &ldquo;ski powder in the Alps&rdquo; or &ldquo;shoot wildlife at golden hour&rdquo;"
                  value={search.query}
                  onChange={(e) => search.setQuery(e.target.value)}
                  className="w-full pl-16 pr-32 py-2.5 sm:py-4 rounded-full text-base sm:text-lg focus:outline-none bg-white/95 backdrop-blur-sm"
                />
                <Button
                  type="submit"
                  className="absolute right-2 px-8 py-2.5 bg-[#a100ff] text-white rounded-full text-lg font-medium hover:bg-opacity-90 transition-all duration-200"
                >
                  Go!
                </Button>
              </div>
            </motion.form>
            {search.status === 'idle' && (
              <motion.p
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-center justify-center gap-1.5 text-white/70 text-xs mt-3"
              >
                <Sparkles size={12} />
                Powered by semantic AI — describe a mood, activity, or place. No keywords needed.
              </motion.p>
            )}
          </motion.div>

          {/* Status + results — fills remaining height, scrolls internally if it overflows */}
          <div className="flex-1 min-h-0 overflow-y-auto max-w-7xl mx-auto w-full pb-6">
            <SemanticSearchResults search={search} />
          </div>
        </div>
      </div>

      {/* Explore by Adventure */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="text-xs font-semibold tracking-widest text-primary-500 uppercase mb-2">Discover</p>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Explore by Adventure</h2>
        <p className="text-gray-500 mb-8">Tap a theme to see AI-matched gear, or just start typing above.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {ADVENTURE_THEMES.map((theme) => (
            <button
              key={theme.title}
              onClick={() => handleThemeClick(theme.query)}
              className="group relative h-56 rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 text-left"
            >
              <img
                src={theme.image}
                alt={theme.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-lg font-bold leading-tight">{theme.title}</h3>
                <p className="text-sm text-white/80">{theme.description}</p>
              </div>
            </button>
          ))}

          <Link
            to="/items"
            className="group relative h-56 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-white text-center p-4"
          >
            <Compass size={32} className="mb-3 transition-transform duration-300 group-hover:rotate-45" />
            <h3 className="text-lg font-bold leading-tight">Browse All Gear</h3>
            <p className="text-sm text-white/80">See the full collection</p>
          </Link>
        </div>
      </div>

      {/* Just Listed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-primary-500 uppercase mb-2">Fresh Arrivals</p>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Just Listed</h2>
          </div>
          <Link
            to="/items"
            className="group text-[#a100ff] hover:text-opacity-90 font-medium flex items-center gap-1.5"
          >
            View all
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
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
    </div>
  );
};

export default Home;
