import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

export default function Results({ results }: { results: string[] }) {
  if (results.length === 0) {
    return null;
  }

  const rendered = results.map(result => {
    return (
      <li key={result}>
        <Link
          href={'/item/' + result}
          className="block px-3 py-2 text-sm rounded-md hover:bg-neutral hover:text-neutral-content focus:bg-neutral focus:text-neutral-content"
        >
          {result}
        </Link>
      </li>
    );
  });

  return (
    <ul className="absolute top-14 w-full flex flex-col p-2 bg-base-100 border border-neutral rounded-md">
      {rendered}
    </ul>
  );
}
