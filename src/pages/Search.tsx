import React, { useEffect, useRef } from 'react';
import { Search as SearchIcon } from 'lucide-react';
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Search Items</h1>
      <p className="text-gray-500 mb-6">
        Describe what you're after — "I want to go skiing this winter" works as well as a product name.
      </p>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={search.query}
              onChange={(e) => search.setQuery(e.target.value)}
              placeholder="e.g. a relaxing beach vacation with warm weather"
              className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <SearchIcon className="absolute right-3 top-2.5 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={search.status === 'thinking'}
          >
            {search.status === 'thinking' ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <SemanticSearchResults search={search} />
    </div>
  );
};

export default Search;
