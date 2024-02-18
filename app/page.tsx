'use client';

import React, {
  useState,
  useRef,
  useEffect,
  MutableRefObject,
  ReactElement,
} from 'react';
import { SearchResponse } from './api/search/route';

import Link from 'next/link';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResponse[]>([]);
  const resultsRef = useRef() as MutableRefObject<HTMLTableElement>;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        e.target !== resultsRef.current &&
        !resultsRef.current?.contains(e.target as Node) &&
        results.length > 0
      ) {
        setResults([]);
      }
    }

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [results]);

  async function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!query) return;

    const res = await fetch('/api/search?query=' + query);
    const data: SearchResponse[] = await res.json();

    setResults(data);
  }

  const renderedResults = results.map(result => {
    return (
      <tr
        className="m-0 border-b border-b-slate-700 [&:last-child]:border-b-0 transition-colors hover:bg-slate-800"
        key={result.title}
      >
        <td className="p-4">
          <Link className="block m-0" href={result.url} target="_blank">
            {result.title}
          </Link>
        </td>
        <td className="p-4">{result.price.high}</td>
      </tr>
    );
  });

  return (
    <main>
      <div className="container max-w-md mx-auto text-center py-16 px-3 prose">
        <h1>OSRS Items</h1>
        <h3>Search Wiki</h3>
        <div className="relative">
          <form className="join gap-3 w-[100%]" onSubmit={handleSearchSubmit}>
            <input
              className="input input-bordered bg-gray-900 border-slate-700 w-[100%]"
              type="text"
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
          </form>
          {results.length > 0 ? (
            <div className="absolute top-[calc(100%+0.75rem)] w-[100%] max-h-72 text-left bg-gray-900 border border-slate-700 rounded-lg overflow-scroll">
              <table className="table m-0" ref={resultsRef}>
                <thead>
                  <tr className="m-0 border-b border-slate-700">
                    <th className="">Item</th>
                    <th className="">Price</th>
                  </tr>
                </thead>
                <tbody>{renderedResults}</tbody>
              </table>
            </div>
          ) : null}
        </div>
        <div className="divider mt-12 mb-6">API Responses</div>
        <div>
          <button className="btn btn-primary">View all items</button>
        </div>
      </div>
    </main>
  );
}
