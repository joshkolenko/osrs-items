import type { ItemData } from '@/types';

import { createItem } from './osrs-wiki';

export default async function getItemData(title: string): Promise<ItemData> {
  title = decodeURIComponent(title);
  const item = createItem(title);

  return {
    title,
    id: await item.getId(),
    diff: await item.getDiff(),
    examine: await item.getExamine(),
    limit: await item.getLimit(),
    priceData: {
      latest: await item.getLatestPriceData(),
      hourly: await item.getPriceData('1h'),
      daily: await item.getPriceData('24h'),
    },
    volume: await item.getVolume(),
  };
}
('');
