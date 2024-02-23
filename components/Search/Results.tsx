import type { Item } from '@/types';

import Link from 'next/link';

export default function Results({
  query,
  results,
}: {
  query: string;
  results: Item[];
}) {
  if (results.length === 0) {
    return null;
  }

  const rendered = results.map(result => {
    const renderedText = result.name.split('').map((char, i) => {
      if (query.toLowerCase().includes(char.toLowerCase())) {
        return (
          <span key={char + i} className="font-semibold text-yellow-500">
            {char}
          </span>
        );
      }

      return char;
    });

    return (
      <li key={result.id}>
        <Link
          href={'/item/' + encodeURIComponent(result.name)}
          className="block px-3 py-2 text-sm rounded-md hover:bg-neutral hover:text-neutral-content focus:bg-neutral focus:text-neutral-content"
        >
          {renderedText}
        </Link>
      </li>
    );
  });

  return (
    <ul className="absolute z-50 top-14 w-full flex flex-col p-2 bg-base-100 border border-neutral rounded-md max-h-[20rem] overflow-scroll">
      {rendered}
    </ul>
  );
}
