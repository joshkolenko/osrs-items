import type { WikiAPIResponse } from '@/types';

import { NextRequest } from 'next/server';
import { getGEIDs } from '@/util/osrs-items';

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

  const geids = await getGEIDs();

  const formattedData: (string | undefined)[] = searchData[1]
    .map(title => {
      if (!geids[title]) return;

      return title;
    })
    .filter(Boolean);

  return Response.json(formattedData);
}
