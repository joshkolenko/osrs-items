'use client';

import type { Item } from '@/types';

import { createContext } from 'react';

export const ItemsContext = createContext([] as Item[]);
export function ItemsProvider({
  children,
  items,
}: {
  children: React.ReactNode;
  items: Item[];
}) {
  return (
    <ItemsContext.Provider value={items}>{children}</ItemsContext.Provider>
  );
}
