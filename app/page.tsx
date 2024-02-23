'use client';

import React from 'react';

import Container from '@/components/Container/Container';

export default function Home() {
  return (
    <main>
      <Container className="py-12 sm:py-20 text-center">
        <h1 className="mb-8 sm:mb-7 flex flex-col">
          <span className="text-8xl sm:text-9xl text-yellow-500 tracking-tighter font-extrabold">
            OSRS
          </span>
          <span className="text-5xl sm:text-7xl font-bold">Item Lookup</span>
        </h1>
        <p className="text-md sm:text-lg">
          Lookup price data for any item in OSRS.
        </p>
        <p className="text-md opacity-50">Search in the bar above.</p>
      </Container>
    </main>
  );
}
