import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const res = await fetch(process.env.PRICES_API_URL);
  const data = await res.json();

  return Response.json(data);
}
