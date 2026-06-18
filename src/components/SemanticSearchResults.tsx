import { AnimatePresence, motion } from 'framer-motion';
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
  /** 'dark' for use over a photo hero, 'light' for use on a plain page background. */
  variant?: 'dark' | 'light';
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

const fadeSwap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

function SkeletonGrid() {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex-shrink-0 w-56 sm:w-64 animate-pulse">
          <div className="bg-gray-100 h-32 sm:h-36 rounded-xl mb-3" />
          <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function SemanticSearchResults({ search, variant = 'dark' }: SemanticSearchResultsProps) {
  const { query, status, results, isSemantic, phrase, errorMessage, retry, submitQuery } = search;

  const matchedCategories = Array.from(
    new Set(results.slice(0, 3).map((r) => r.category))
  );

  return (
    <AnimatePresence mode="wait">
      {status === 'idle' && (
        <motion.div key="idle" {...fadeSwap}>
          <p className={`text-center text-sm mb-3 ${variant === 'dark' ? 'text-white/70' : 'text-gray-400'}`}>
            Or get inspired:
          </p>
          <motion.div
            className="flex flex-wrap gap-2 justify-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {EXAMPLE_QUERIES.map((example) => (
              <motion.button
                key={example}
                variants={itemVariants}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => submitQuery(example)}
                className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white shadow-soft hover:border-[#a100ff] hover:text-[#a100ff] transition-colors"
              >
                {example}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      )}

      {status === 'thinking' && (
        <motion.div key="thinking" {...fadeSwap}>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <motion.span
              animate={{ scale: [1, 1.2, 1], rotate: [0, 8, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={16} className="text-[#a100ff]" />
            </motion.span>
            <AnimatePresence mode="wait">
              <motion.span
                key={phrase}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                {phrase}
              </motion.span>
            </AnimatePresence>
          </div>
          <SkeletonGrid />
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div key="error" {...fadeSwap} className="text-center py-12">
          <p className="text-red-500 font-medium mb-4">{errorMessage}</p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={retry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <RotateCcw size={14} /> Try again
          </motion.button>
        </motion.div>
      )}

      {status === 'results' && results.length === 0 && (
        <motion.div key="empty" {...fadeSwap} className="text-center py-12">
          <p className="text-gray-600 text-lg font-medium">Nothing matched "{query}" yet</p>
          <p className="text-gray-400 mt-2 mb-6">
            Try describing the activity or feeling you're after — like "cozy mountain weekend" or "underwater photography".
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {EXAMPLE_QUERIES.slice(0, 3).map((example) => (
              <button
                key={example}
                onClick={() => submitQuery(example)}
                className="px-4 py-1.5 rounded-full border border-gray-200 text-sm text-gray-600 bg-white shadow-soft hover:border-[#a100ff] hover:text-[#a100ff] transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {status === 'results' && results.length > 0 && (
        <motion.div key="results" {...fadeSwap}>
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="inline-flex items-center gap-2 text-sm text-gray-600 mb-6 bg-primary-50 border border-primary-100 rounded-full px-3.5 py-1.5 shadow-soft"
          >
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
          </motion.div>

          <motion.div
            className="flex gap-4 overflow-x-auto pb-2"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {results.map((item) => (
              <motion.div key={item.id} variants={itemVariants} className="flex-shrink-0 w-56 sm:w-64">
                <ItemCard item={item} compact className="h-full" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
