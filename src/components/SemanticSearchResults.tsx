import { Sparkles, RotateCcw } from 'lucide-react';
import ItemCard from './ItemCard';
import { useSemanticSearch } from '../hooks/useSemanticSearch';

const EXAMPLE_QUERIES = [
  'I want a relaxing beach vacation',
  'I want to explore historic cities',
  'I want to go skiing this winter',
  'I want to photograph wildlife and landscapes',
];

interface SemanticSearchResultsProps {
  search: ReturnType<typeof useSemanticSearch>;
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 h-48 rounded-lg mb-4" />
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function SemanticSearchResults({ search }: SemanticSearchResultsProps) {
  const { query, status, results, isSemantic, phrase, debugMode, setDebugMode, errorMessage, retry, submitQuery } = search;

  const matchedCategories = Array.from(
    new Set(results.slice(0, 3).map((r) => r.category))
  );

  if (status === 'idle') {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {EXAMPLE_QUERIES.map((example) => (
          <button
            key={example}
            onClick={() => submitQuery(example)}
            className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white hover:border-[#a100ff] hover:text-[#a100ff] transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    );
  }

  if (status === 'thinking') {
    return (
      <div>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <Sparkles size={16} className="text-[#a100ff] animate-pulse" />
          <span>{phrase}</span>
        </div>
        <SkeletonGrid />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 font-medium mb-4">{errorMessage}</p>
        <button
          onClick={retry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
        >
          <RotateCcw size={14} /> Try again
        </button>
      </div>
    );
  }

  // status === 'results'
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg font-medium">No matches for "{query}"</p>
        <p className="text-gray-400 mt-2">Try describing what you want to do, not just what you want to rent.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Sparkles size={14} className={isSemantic ? 'text-[#a100ff]' : 'text-gray-400'} />
          {isSemantic ? (
            <span>
              AI-ranked by meaning
              {matchedCategories.length > 0 && (
                <span className="text-gray-400"> · matched on {matchedCategories.join(', ')}</span>
              )}
            </span>
          ) : (
            <span>Keyword search (AI ranking temporarily unavailable)</span>
          )}
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="accent-[#a100ff]"
          />
          Show AI scores
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((item, i) => (
          <ItemCard
            key={item.id}
            item={item}
            className="opacity-0 animate-fadeInUp"
            style={{ animationDelay: `${i * 90}ms` }}
            matchInfo={
              debugMode
                ? { score: item.match_score, vectorRank: item.vector_rank, keywordRank: item.keyword_rank }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
}
