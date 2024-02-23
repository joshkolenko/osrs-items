import type { TimeseriesData } from '@/types';

import { getItem, getTimeseries, getItems } from '@/util/osrs-items';

import Container from '@/components/Container/Container';
import Stats from '@/components/Stats';
import Icon from '@/components/Icon';

export async function generateStaticParams() {
  const items = await getItems();

  return items.map(item => ({
    name: item.name,
  }));
}

export default async function Page({ params }: { params: { name: string } }) {
  const name = decodeURIComponent(params.name);

  const item = await getItem(name);

  const prices: TimeseriesData = {
    latest: await getTimeseries(item.id, '5m'),
    hourly: await getTimeseries(item.id, '1h'),
    daily: await getTimeseries(item.id, '24h'),
  };

  return (
    <Container className="pt-6 pb-12 sm:py-20">
      <div className="flex flex-col items-start md:flex-row md:items-center gap-6 mb-6">
        {item.icon && <Icon name={item.name} />}
        <div>
          <h1 className="text-5xl sm:text-4xl leading-[3.25rem] font-bold mb-4">
            {item.name}
          </h1>
          <p>{item.examine}</p>
        </div>
      </div>
      <Stats item={item} prices={prices} />
    </Container>
  );
}
