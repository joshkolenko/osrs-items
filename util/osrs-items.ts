import type { Item, Price, Timeseries } from '@/types';

const url = 'https://prices.runescape.wiki/api/v1/osrs';

async function getPrices(): Promise<{ [key: string]: Price }> {
  const res = await fetch(`${url}/latest`).then(res => res.json());
  return res.data;
}

async function getVolumes(): Promise<{ [key: string]: number }> {
  const res = await fetch(
    `https://oldschool.runescape.wiki/api.php?action=expandtemplates&format=json&prop=wikitext&text={{Module:GEVolumes/data.json}}`
  ).then(res => res.json());
  const data = JSON.parse(res.expandtemplates.wikitext);
  return data;
}

export async function getItems(): Promise<Item[]> {
  const prices = await getPrices();
  const volumes = await getVolumes();
  const data = await fetch(`${url}/mapping`).then(res => res.json());

  const items: Item[] = data
    .filter((item: Item) => prices[item.id])
    .map((item: Item) => {
      const price = prices[item.id];

      return {
        ...item,
        icon: item.icon.replaceAll(' ', '_'),
        volume: volumes[item.name],
        price,
      };
    });

  return items;
}

export function findItem(name: string, items: Item[]): Item {
  const item = items.find((item: Item) => item.name === name);
  return item as Item;
}

export async function getItem(name: string): Promise<Item> {
  const items = await getItems();
  const item = findItem(name, items);

  return item;
}

export async function getTimeseries(
  id: number,
  timestep: '5m' | '1h' | '6h' | '24h' = '24h'
): Promise<Timeseries[]> {
  const res = await fetch(
    `${url}/timeseries?id=${id}&timestep=${timestep}`
  ).then(res => res.json());

  const data: Timeseries[] = res.data.map((point: Timeseries) => {
    return {
      ...point,
      date: formatUnixTimestamp(point.timestamp),
    };
  });

  return data;
}

export async function search(query: string) {
  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'opensearch');
  url.searchParams.append('search', query);
  url.searchParams.append('format', 'json');

  const res = await fetch(url);

  return await res.json();
}

function formatUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export const imgUrl = 'https://oldschool.runescape.wiki/images/';

const osrsWiki = {
  search,
  getItems,
  getItem,
  imgUrl,
};

export default osrsWiki;
