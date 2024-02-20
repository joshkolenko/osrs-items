import type { PriceDataLatest, PriceDataTimeseries } from '@/types';

export async function expandWikiTemplate(template: string, params: string[]) {
  params.unshift(template);

  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'expandtemplates');
  url.searchParams.append('prop', 'wikitext');
  url.searchParams.append('text', '{{Template:' + params.join('|') + '}}');
  url.searchParams.append('format', 'json');

  const res = await fetch(url);

  const json = await res.json();

  return json.expandtemplates.wikitext;
}

export async function search(query: string) {
  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'opensearch');
  url.searchParams.append('search', query);
  url.searchParams.append('format', 'json');

  const res = await fetch(url);
  const json = await res.json();

  return json[1];
}

// Items

export async function getGEIDs() {
  const res = await fetch(
    'https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson'
  );

  return await res.json();
}

export async function getId(title: string) {
  const id = await expandWikiTemplate('GEId', [title]);
  return parseInt(id);
}

export async function getDiff(title: string) {
  const diff = await expandWikiTemplate('GEDiff', [title]);
  return parseInt(diff);
}

export async function getExamine(title: string) {
  const examine = await expandWikiTemplate('GEInfo', [title, 'examine']);
  return examine;
}

export async function getLimit(title: string) {
  const limit = await expandWikiTemplate('GEInfo', [title, 'limit']);
  return parseInt(limit);
}

export async function getVolume(title: string) {
  const volume = await expandWikiTemplate('GEInfo', [title, 'volume']);
  return parseInt(volume);
}

export async function getPriceData(
  title: string,
  timestep: '5m' | '1h' | '6h' | '24h' = '5m'
): Promise<PriceDataTimeseries> {
  const id = await getId(title);

  const url = new URL('https://prices.runescape.wiki/api/v1/osrs/timeseries');
  url.searchParams.append('id', id.toString());
  url.searchParams.append('timestep', timestep);

  const res = await fetch(url);
  const json = await res.json();

  return json.data;
}

export async function getLatestPriceData(
  title: string
): Promise<PriceDataLatest> {
  const id = await getId(title);

  const url = new URL('https://prices.runescape.wiki/api/v1/osrs/latest');
  url.searchParams.append('id', id.toString());

  const res = await fetch(url);
  const json = await res.json();

  return json.data[id.toString()];
}

export function formatUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function createItem(title: string) {
  return {
    getId() {
      return getId(title);
    },
    getDiff() {
      return getDiff(title);
    },
    getExamine() {
      return getExamine(title);
    },
    getLimit() {
      return getLimit(title);
    },
    getPriceData(timestep: '5m' | '1h' | '6h' | '24h') {
      return getPriceData(title, timestep);
    },
    getLatestPriceData() {
      return getLatestPriceData(title);
    },
    getVolume() {
      return getVolume(title);
    },
  };
}

const osrsWiki = {
  search,
  getId,
  getDiff,
  getExamine,
  getGEIDs,
  getLimit,
  getPriceData,
  getLatestPriceData,
  getVolume,
  createItem,
};

export default osrsWiki;
