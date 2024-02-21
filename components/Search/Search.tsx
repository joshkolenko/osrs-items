'use client';

import { useEffect, useState, useCallback, useRef, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { getData } from '@/util/osrs-wiki';
import { matchSorter } from 'match-sorter';
import Results from './Results';

export default function Search() {
  const [geids, setGeids] = useState({} as { [key: string]: number });
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as string[]);
  const inputRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    async function getGeids() {
      console.log('FETCHING');
      const { geids } = await getData('geids');
      setGeids(geids);
    }

    getGeids();
  }, []);

  const updateResults = useCallback(() => {
    if (query) {
      const matches = matchSorter(Object.keys(geids), query).slice(0, 25);

      setResults(matches);
    } else {
      setResults([]);
    }
  }, [query, geids]);

  useEffect(() => {
    updateResults();
  }, [query, updateResults]);

  useEffect(() => {
    function clearResults() {
      if (results.length > 0) {
        setResults([]);
      }
    }

    function handleClick(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        clearResults();
      }
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        clearResults();
      }

      if (e.metaKey && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeydown);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [results]);

  return (
    <div className="relative w-full">
      <label
        className="input bg-base-200 focus-within:outline-none focus-within:border-neutral cursor-text h-12 sm:h-10 flex items-center gap-4 w-full"
        ref={inputRef}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="w-4 h-4 text-base-content opacity-50"
        />
        <input
          className="w-full text-base-content placeholder:text-base-content placeholder:opacity-75"
          type="text"
          placeholder="Search items..."
          onChange={e => setQuery(e.target.value)}
          onFocus={updateResults}
        />
        <div className="flex gap-1 items-center">
          <kbd className="kbd kbd-sm hidden sm:flex">⌘</kbd>
          <kbd className="kbd kbd-sm hidden sm:flex">K</kbd>
        </div>
      </label>
      <Results query={query} results={results} />
    </div>
  );
}
