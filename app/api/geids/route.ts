import { getGEIDs } from '@/util/osrs-wiki';

export async function GET() {
  const geids = await getGEIDs();
  return Response.json(geids);
}
