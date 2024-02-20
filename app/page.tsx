'use client';

import React, { useState, useRef, useEffect, MutableRefObject } from 'react';

import Link from 'next/link';
import Container from '@/components/Container/Container';

export default function Home() {
  return (
    <main>
      <Container className="py-12 sm:py-20">
        <h1 className="text-4xl sm:text-6xl text-primary font-bold mb-5 sm:mb-7">
          OSRS Item Lookup
        </h1>
        <p className="text-md sm:text-lg">
          Lookup price data for any item in OSRS.
        </p>
        <p className="text-md opacity-50">Search in the bar above.</p>
      </Container>
    </main>
  );
}
