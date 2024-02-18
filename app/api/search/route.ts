import { NextRequest } from 'next/server';
import fs from 'fs';

type WikiAPIResponse = [string, string[], string[], string[]];
export type SearchResponse = {
  geid: number;
  title: string;
  url: string;
  price: {
    high: number;
    highTime: number;
    low: number;
    lowTime: number;
  };
};

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const query = params.get('query');

  if (!query) {
    return Response.json(
      {
        error: true,
        errorMessage: 'No query provided.',
        errorCode: 'NO_QUERY',
      },
      {
        status: 400,
      }
    );
  }

  const searchURL = new URL(process.env.WIKI_API_URL);
  searchURL.searchParams.set('action', 'opensearch');
  searchURL.searchParams.set('search', query);
  searchURL.searchParams.set('limit', '20');
  searchURL.searchParams.set('format', 'json');

  const searchResponse = await fetch(searchURL);
  const searchData: WikiAPIResponse = await searchResponse.json();

  const priceResponse = await fetch(process.env.PRICES_API_URL + '/latest');
  const priceData = (await priceResponse.json()).data;

  const geids = JSON.parse(
    fs.readFileSync(process.cwd() + 'app/api/data/geids.json', 'utf-8')
  );

  const formattedData: (SearchResponse | undefined)[] = searchData[1]
    .map((title, i) => {
      const geid: number = geids[title];

      if (!geid) return;

      return {
        geid,
        title,
        url: searchData[3][i],
        price: priceData[geid],
      };
    })
    .filter(Boolean);

  return Response.json(formattedData);
}
