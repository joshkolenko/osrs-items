import type { Item } from '@/types';

import { useContext } from 'react';
import { ItemsContext } from '@/context/Items';

export default function useItems(): Item[] {
  const items = useContext(ItemsContext);
  return items;
}
