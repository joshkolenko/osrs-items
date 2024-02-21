import type { OSRSWiki } from '@/types';

async function getWikiTextData(properties: OSRSWiki.WikitextData.Property[]) {
  const req: {
    [key in keyof OSRSWiki.PropertyMap]?: string;
  } = {};

  properties.forEach(property => {
    if (property.name) {
      const name = property.name as OSRSWiki.PropertyMapKey;
      req[name] = property.wikitext;
    }
  });

  const url = new URL('https://oldschool.runescape.wiki/api.php');
  url.searchParams.append('action', 'expandtemplates');
  url.searchParams.append('prop', 'wikitext');
  url.searchParams.append('text', JSON.stringify(req));
  url.searchParams.append('format', 'json');

  const res = await fetch(url);
  const json = await res.json();
  const cleaned = json.expandtemplates.wikitext.replace(
    /(?:"(?={)|(?<=})")/gm,
    ''
  );

  const data = JSON.parse(cleaned);

  return data;
}

async function getRealTimePriceData(
  properties: OSRSWiki.RealTimePriceData.Property[]
) {
  const data: {
    [key: string]: any;
  } = {};

  for await (const property of properties) {
    const { name, url, params } = property;

    params?.forEach(param => url.searchParams.append(param.name, param.value));

    const res = await fetch(url);
    const json = (await res.json()).data;

    if (name === 'latest') {
      const id = params?.find(param => param.name === 'id')?.value;
      data[name] = json[id as string] as OSRSWiki.RealTimePriceData.Latest;
    } else if (name) {
      data[name] = json;
    }
  }

  Object.keys(data).forEach(key => {
    const value = data[key];
    if (!isNaN(value) && !isNaN(parseInt(value))) {
      data[key] = parseInt(value);
    }
  });

  return data;
}

function mapProperties(
  map: OSRSWiki.PropertyMap,
  properties: OSRSWiki.PropertyMapKey[]
) {
  const mappedProperties: OSRSWiki.MappedProperties = {
    wikitext: [],
    realTimePrice: [],
  };

  properties.forEach(property => {
    const data = (map as OSRSWiki.PropertyMap)[property];
    data.name = property as string;

    if (data.type === 'wikitext') {
      mappedProperties.wikitext.push(data);
    } else if (data.type === 'real-time-price') {
      mappedProperties.realTimePrice.push(data);
    }
  });

  return mappedProperties;
}

async function dispatch(
  map: OSRSWiki.ItemData.PropertyMap | OSRSWiki.Data.PropertyMap,
  properties:
    | (OSRSWiki.Data.PropertyMapKey | OSRSWiki.Data.PropertyMapKey[])
    | (OSRSWiki.ItemData.PropertyKey | OSRSWiki.ItemData.PropertyKey[])
) {
  const array = Array.isArray(properties) ? properties : [properties];

  const mappedProperties = mapProperties(
    map as OSRSWiki.PropertyMap,
    array as OSRSWiki.PropertyMapKey[]
  );

  const wikitextData = await getWikiTextData(mappedProperties.wikitext);
  const realTimePriceData = await getRealTimePriceData(
    mappedProperties.realTimePrice
  );

  const data = {
    ...wikitextData,
    ...realTimePriceData,
  };

  return data;
}

export async function getItemData(
  item: string = '',
  properties: OSRSWiki.ItemData.PropertyKey[] | OSRSWiki.ItemData.PropertyKey,
  options: OSRSWiki.ItemData.Options = { timestep: '5m' }
) {
  const { timestep } = options;

  let id = '';

  const map: OSRSWiki.ItemData.PropertyMap = {
    id: {
      type: 'wikitext',
      wikitext: `{{GEId|${item}}}`,
    },
    diff: {
      type: 'wikitext',
      wikitext: `{{GEDiff|${item}}}`,
    },
    examine: {
      type: 'wikitext',
      wikitext: `{{GEInfo|${item}|examine}}`,
    },
    ha: {
      type: 'wikitext',
      wikitext: `{{HA|${item}}}`,
    },
    la: {
      type: 'wikitext',
      wikitext: `{{LA|${item}}}`,
    },
    limit: {
      type: 'wikitext',
      wikitext: `{{GEInfo|${item}|limit}}`,
    },
    volume: {
      type: 'wikitext',
      wikitext: `{{GEInfo|${item}|volume}}`,
    },
    latest: {
      type: 'real-time-price',
      url: new URL('https://prices.runescape.wiki/api/v1/osrs/latest'),
      params: [
        {
          name: 'id',
          value: await getId(),
        },
      ],
    },
    timeseries: {
      type: 'real-time-price',
      url: new URL(`https://prices.runescape.wiki/api/v1/osrs/timeseries`),
      params: [
        {
          name: 'id',
          value: await getId(),
        },
        {
          name: 'timestep',
          value: timestep || '5m',
        },
      ],
      timestep,
    },
  };

  async function getId() {
    const idRequired = ['latest', 'timeseries'].some(prop =>
      Array.isArray(properties)
        ? properties.includes(prop as OSRSWiki.ItemData.PropertyKey)
        : properties === prop
    );

    if (!id && idRequired) {
      id = (await getItemData(item, 'id')).id;
    }

    return id;
  }

  return await dispatch(map, properties);
}

export async function getData(
  properties: OSRSWiki.Data.PropertyMapKey[] | OSRSWiki.Data.PropertyMapKey
) {
  const map: OSRSWiki.Data.PropertyMap = {
    geids: {
      type: 'wikitext',
      wikitext: `{{Module:GEIDs/data.json}}`,
    },
    prices: {
      type: 'real-time-price',
      url: new URL('https://prices.runescape.wiki/api/v1/osrs/latest'),
    },
  };

  return await dispatch(map, properties);
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

// export async function getPriceDataTimeseries(
//   title: string,
//   timestep: '5m' | '1h' | '6h' | '24h' = '5m'
// ): Promise<OSRSWiki.RealTimePriceData.Timeseries> {
//   const id = (await getData(['id'], title)).id;

//   const url = new URL('https://prices.runescape.wiki/api/v1/osrs/timeseries');
//   url.searchParams.append('id', id.toString());
//   url.searchParams.append('timestep', timestep);

//   const res = await fetch(url);
//   const json = await res.json();

//   return json.data;
// }

// export async function getPriceData(
//   title: string
// ): Promise<OSRSWiki.RealTimePriceData.Latest> {
//   const id = (await getData(['id'], title)).id;

//   const url = new URL('https://prices.runescape.wiki/api/v1/osrs/latest');
//   url.searchParams.append('id', id.toString());

//   const res = await fetch(url);
//   const json = await res.json();

//   return json.data[id.toString()];
// }

export function formatUnixTimestamp(timestamp: number) {
  return new Date(timestamp * 1000);
}

export function createItem(item: string) {
  return {
    getData(
      properties:
        | OSRSWiki.ItemData.PropertyKey
        | OSRSWiki.ItemData.PropertyKey[],
      options?: OSRSWiki.ItemData.Options
    ) {
      return getItemData(item, properties, options);
    },
  };
}

const osrsWiki = {
  search,
  getData,
  createItem,
};

export default osrsWiki;
