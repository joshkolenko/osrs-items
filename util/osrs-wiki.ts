import type { OSRSWiki } from '@/types';

import path from 'path';
import { decode } from 'html-entities';

async function getTemplateData(templates: Partial<OSRSWiki.Templates>) {
  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'expandtemplates');
  url.searchParams.append('prop', 'wikitext');
  url.searchParams.append('text', JSON.stringify(templates));
  url.searchParams.append('format', 'json');

  const res = await fetch(url);
  const json = await res.json();
  const data = JSON.parse(json.expandtemplates.wikitext);

  const typeMap = {
    examine: 'string',
    ha: 'number',
    icon: 'string',
    la: 'number',
    limit: 'number',
    members: 'boolean',
    volume: 'number',
  };

  Object.entries(typeMap).forEach(([key, type]) => {
    if (data[key]) {
      if (type === 'number') {
        data[key] = parseInt(data[key]);
      }

      if (type === 'boolean') {
        data[key] = data[key] === '1';
      }

      if (type === 'string') {
        data[key] = decode(data[key].trim());
      }
    }
  });

  if (data.icon) {
    data.icon = data.icon.replaceAll(' ', '_');
  }

  return data as OSRSWiki.TemplateData;
}

async function getGeids() {
  const res = await fetch(
    'https://oldschool.runescape.wiki/?title=Module:GEIDs/data.json&action=raw&ctype=application%2Fjson'
  );
  const data = await res.json();

  return data as OSRSWiki.GEIDs;
}

export async function getData<
  P extends OSRSWiki.Property,
  O extends OSRSWiki.Options
>(props: P | P[], options?: O) {
  const properties = Array.isArray(props) ? props : [props];

  const defaults: OSRSWiki.Options = {
    item: '',
    timestep: '24h',
  };

  const settings: OSRSWiki.Options = Object.assign(defaults, options);

  const { item, timestep } = settings;

  const geids = (await getGeids()) as OSRSWiki.GEIDs;
  let id = 0;

  const requiresItem: Partial<OSRSWiki.Property[]> = [
    'examine',
    'ha',
    'icon',
    'la',
    'limit',
    'members',
    'volume',
  ];

  const itemRequired = properties.some(prop => requiresItem.includes(prop));

  if (itemRequired) {
    if (!item) {
      throw new Error('Item is required');
    }

    const itemId = geids[item];

    if (typeof itemId === 'number') {
      id = itemId;
    }

    if (!id) {
      throw new Error('Item not found');
    }
  }

  const templates: OSRSWiki.Templates = {
    examine: `{{GEInfo|${item}|examine}}`,
    ha: `{{HA|${item}}}`,
    icon: `{{GEInfo|${item}|icon}}`,
    members: `{{GEInfo|${item}|members}}`,
    la: `{{LA|${item}}}`,
    limit: `{{GEInfo|${item}|limit}}`,
    volume: `{{GEInfo|${item}|volume}}`,
  };

  const filteredTemplates: OSRSWiki.FilteredTemplates = Object.fromEntries(
    Object.keys(templates)
      .filter(key => properties.includes(key as P))
      .map(key => [key, templates[key as keyof OSRSWiki.Templates]])
  );

  const priceAPIURL = new URL(
    'https://prices.runescape.wiki/api/v1/osrs/latest'
  );

  const requests: OSRSWiki.Requests = {
    async templates() {
      return await getTemplateData(filteredTemplates);
    },
    geids() {
      return geids;
    },
    id() {
      return id;
    },
    async latest() {
      const url = priceAPIURL;
      url.searchParams.append('id', id.toString());

      const res = await fetch(url);
      return (await res.json()).data[id];
    },
    async prices() {
      const res = await fetch(priceAPIURL);

      return (await res.json()).data;
    },
    async timeseries() {
      if (!timestep) {
        throw new Error('Timestep is required for timeseries data');
      }

      const timesteps: OSRSWiki.Timestep[] = Array.isArray(timestep)
        ? timestep
        : [timestep];

      const url = new URL(
        'https://prices.runescape.wiki/api/v1/osrs/timeseries'
      );
      url.searchParams.append('id', id.toString());

      const data: {
        [key: string]: any;
      } = {};

      for await (const step of timesteps) {
        url.searchParams.set('timestep', step);
        const res = await fetch(url);

        data[step] = (await res.json()).data;
      }

      return data;
    },
  };

  const data: {
    [key: string]: Partial<OSRSWiki.Data>;
  } = {};

  const filteredRequests = Object.fromEntries(
    Object.entries(requests).filter(([key]) => properties.includes(key as P))
  );

  if (filteredTemplates) {
    filteredRequests.templates = requests.templates;
  }

  for await (const [key, value] of Object.entries(filteredRequests)) {
    if (key === 'templates') {
      const templates: OSRSWiki.TemplateData = await value();

      Object.entries(templates).forEach(([key, value]) => {
        data[key] = value as Partial<OSRSWiki.Data>;
      });

      continue;
    }

    data[key] = await value();
  }

  return data as {
    [K in P]: OSRSWiki.Data[K];
  };
}

export async function search(query: string) {
  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'opensearch');
  url.searchParams.append('search', query);
  url.searchParams.append('format', 'json');

  const res = await fetch(url);

  return await res.json();
}

export function formatUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function iconPath(icon: string, detailed = false) {
  if (detailed) {
    const { name, ext } = path.parse(icon);
    return `https://oldschool.runescape.wiki/images/${name}_detail${ext}`;
  }

  return `https://oldschool.runescape.wiki/images/${icon}`;
}

const osrsWiki = {
  search,
  getData,
  formatUnixTimestamp,
  iconPath,
};

export default osrsWiki;
