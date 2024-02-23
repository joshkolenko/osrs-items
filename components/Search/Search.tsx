'use client';

import type { Item } from '@/types';

import { useEffect, useState, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { matchSorter } from 'match-sorter';

import useItems from '@/hooks/useItems';
import Results from './Results';

export default function Search() {
  const items = useItems();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([] as Item[]);
  const inputRef = useRef<HTMLLabelElement>(null);

  const updateResults = useCallback(() => {
    if (query && items.length > 0) {
      const matches = matchSorter(items, query, {
        keys: ['name'],
      }).slice(0, 25);

      setResults(matches);
    } else {
      setResults([]);
    }
  }, [query, items]);

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
