import { useEffect, useRef, useState } from 'react';
import { semanticSearchItems, SemanticSearchResult } from '../lib/supabase';

export type SearchStatus = 'idle' | 'thinking' | 'results' | 'error';

export const THINKING_PHRASES = [
  'Interpreting intent…',
  'Searching semantic space…',
  'Ranking relevant experiences…',
];

const PHRASE_INTERVAL_MS = 700;
const MIN_THINKING_MS = 600;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function useSemanticSearch() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isSemantic, setIsSemantic] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const requestIdRef = useRef(0);

  useEffect(() => {
    if (status !== 'thinking') return;
    const interval = setInterval(() => {
      setPhraseIndex((i) => Math.min(i + 1, THINKING_PHRASES.length - 1));
    }, PHRASE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [status]);

  const runSearch = async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setStatus('idle');
      setResults([]);
      return;
    }

    const requestId = ++requestIdRef.current;
    setStatus('thinking');
    setPhraseIndex(0);
    setErrorMessage('');

    const startedAt = Date.now();

    try {
      const { results: searchResults, semantic } = await semanticSearchItems(trimmed);

      if (requestId !== requestIdRef.current) return; // a newer search superseded this one

      const elapsed = Date.now() - startedAt;
      if (elapsed < MIN_THINKING_MS) {
        await sleep(MIN_THINKING_MS - elapsed);
      }
      if (requestId !== requestIdRef.current) return;

      setResults(searchResults);
      setIsSemantic(semantic);
      setStatus('results');
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      setErrorMessage(error instanceof Error ? error.message : 'Search failed');
      setStatus('error');
    }
  };

  const submit = () => runSearch(query);
  const retry = () => runSearch(query);
  const submitQuery = (text: string) => {
    setQuery(text);
    runSearch(text);
  };

  const reset = () => {
    requestIdRef.current++;
    setQuery('');
    setStatus('idle');
    setResults([]);
  };

  return {
    query,
    setQuery,
    status,
    results,
    isSemantic,
    phrase: THINKING_PHRASES[phraseIndex],
    errorMessage,
    submit,
    submitQuery,
    retry,
    reset,
  };
}
