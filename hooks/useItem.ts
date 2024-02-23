import { findItem } from '@/util/osrs-items';
import useItems from './useItems';

export default function useItem(name: string) {
  const items = useItems();
  return findItem(name, items);
}
