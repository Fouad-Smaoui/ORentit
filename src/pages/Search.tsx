import React, { useEffect, useRef } from 'react';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { useSemanticSearch } from '../hooks/useSemanticSearch';
import SemanticSearchResults from '../components/SemanticSearchResults';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const search = useSemanticSearch();
  const ranInitialQuery = useRef(false);

  // Support direct links like /search?q=... by running the search once on load.
  useEffect(() => {
    if (ranInitialQuery.current) return;
    ranInitialQuery.current = true;
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      search.submitQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    search.submit();
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-gray-50">
      {/* Header + search bar — fixed at the top of the panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex-shrink-0 container mx-auto px-4 pt-8 pb-4"
      >
        <div className="flex items-center gap-1.5 text-xs font-medium text-primary-500 mb-2">
          <Sparkles size={14} />
          SEMANTIC AI SEARCH
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Find Your Next Rental</h1>
        <p className="text-gray-500 mb-6">
          Describe what you want to do — our AI finds the right gear to rent, not just keyword matches.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <div className="flex-1 relative rounded-lg shadow-glow focus-within:shadow-[0_0_0_3px_rgb(161,0,255,0.18),0_8px_32px_-8px_rgb(161,0,255,0.35)] transition-shadow duration-300">
              <input
                type="text"
                value={search.query}
                onChange={(e) => search.setQuery(e.target.value)}
                placeholder="e.g. a relaxing beach vacation with warm weather"
                className="w-full pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none bg-white"
              />
              <SearchIcon className="absolute right-3 top-3 text-gray-400" size={18} />
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary-500 text-white rounded-lg font-medium shadow-soft hover:shadow-elevated hover:bg-primary-600 active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
              disabled={search.status === 'thinking'}
            >
              {search.status === 'thinking' ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Status + results — fills remaining height, scrolls internally if it overflows */}
      <div className="flex-1 min-h-0 overflow-y-auto container mx-auto px-4 pb-6">
        <SemanticSearchResults search={search} variant="light" />
      </div>
    </div>
  );
};

export default Search;
