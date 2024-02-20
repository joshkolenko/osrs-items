'use client';

import { useEffect, useState, useCallback, useRef, RefObject } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { search, getGEIDs } from '@/util/osrs-wiki';
import { useDebounce } from 'use-debounce';
import Results from './Results';

export default function Search() {
  const [geids, setGeids] = useState({} as { [key: string]: number });
  const [value, setValue] = useState('');
  const [query] = useDebounce(value, 200);
  const [results, setResults] = useState([] as string[]);
  const inputRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    async function getGeids() {
      const geids = await getGEIDs();
      setGeids(geids);
    }

    getGeids();
  }, []);

  const updateResults = useCallback(() => {
    async function getResults() {
      console.log('getResults');
      const results: string[] = await search(query);
      const filteredResults = results.filter(result => geids[result]);

      setResults(filteredResults);
    }

    if (query) {
      getResults();
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
        className="input input-ghost focus-within:outline-none focus-within:border-neutral cursor-text h-10 flex items-center gap-4 w-full"
        ref={inputRef}
      >
        <FontAwesomeIcon
          icon={faSearch}
          className="w-4 h-4 text-base-content opacity-50"
        />
        <input
          className="text-sm w-full text-base-content placeholder:text-base-content placeholder:opacity-75"
          type="text"
          placeholder="Search items..."
          onChange={e => setValue(e.target.value)}
          onFocus={updateResults}
        />
        <div className="flex gap-1 items-center">
          <kbd className="kbd kbd-sm hidden sm:flex">⌘</kbd>
          <kbd className="kbd kbd-sm hidden sm:flex">K</kbd>
        </div>
      </label>
      <Results results={results} />
    </div>
  );
}
