'use client';

import React, { useState, useRef, useEffect, MutableRefObject } from 'react';

import Link from 'next/link';
import Container from '@/components/Container/Container';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

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
    const data: string[] = await res.json();

    setResults(data);
  }

  const renderedResults = results.map(result => {
    return (
      <tr
        className="m-0 border-b border-b-slate-700 [&:last-child]:border-b-0 transition-colors hover:bg-slate-800"
        key={result}
      >
        <td className="p-0">
          <Link className="block m-0 p-4" href={`item/${result}`}>
            {result}
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <main>
      <Container>
        <h1>OSRS Items</h1>
        <h3>Search</h3>
        <div className="relative max-w-md mx-auto">
          <form className="join gap-3 w-[100%]" onSubmit={handleSearchSubmit}>
            <input
              className="input input-bordered bg-gray-900 border-slate-700 w-[100%]"
              type="text"
              onChange={e => setQuery(e.target.value)}
            />
            <button className="btn btn-primary">Search</button>
          </form>
          {results.length > 0 ? (
            <div className="absolute top-[calc(100%+0.75rem)] left-[50%] translate-x-[-50%] w-[100%] max-h-72 text-left bg-gray-900 border border-slate-700 rounded-lg overflow-scroll">
              <table className="table m-0" ref={resultsRef}>
                <tbody>{renderedResults}</tbody>
              </table>
            </div>
          ) : null}
        </div>
        {/* <div className="divider mt-12 mb-6">API Responses</div>
        <div>
          <button className="btn btn-primary">View all items</button>
        </div> */}
      </Container>
    </main>
  );
}
