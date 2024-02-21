import Container from '@/components/Container/Container';
import PriceChange from '@/components/PriceChange/PriceChange';

import { createItem, getItemData } from '@/util/osrs-wiki';

import numeral from 'numeral';

export default async function Page({ params }: { params: { slug: string } }) {
  const title = decodeURIComponent(params.slug);

  const item = createItem(title);

  const { latest, timeseries, volume, ha, la, limit, examine } =
    await getItemData(
      title,
      ['latest', 'timeseries', 'volume', 'ha', 'la', 'limit', 'examine'],
      { timestep: '24h' }
    );

  const profit = latest.low - latest.high;

  function getRecentPrice(prop: 'avgHighPrice' | 'avgLowPrice') {
    let recentPrice = 0;

    for (let i = timeseries.length - 1; i >= 0; i--) {
      const price = timeseries[i][prop];

      if (price !== null) {
        recentPrice = price;
        break;
      }
    }

    return recentPrice;
  }

  return (
    <Container className="py-12 sm:py-20">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4">{title}</h1>
      <p className="mb-6">{examine}</p>
      <div className="flex flex-wrap gap-6">
        <div className="stats stats-vertical lg:stats-horizontal flex-shrink-0 w-full lg:w-auto bg-base-200">
          <div className="stat">
            <div className="stat-title">Buy price</div>
            <div className="stat-value">
              {numeral(latest.high).format('0,0')} coins
            </div>
            <div className="stat-desc">
              <PriceChange
                latest={latest.high}
                previous={getRecentPrice('avgHighPrice')}
              />
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Sell price</div>
            <div className="stat-value">
              {numeral(latest.low).format('0,0')} coins
            </div>
            <div className="stat-desc">
              <PriceChange
                latest={latest.low}
                previous={getRecentPrice('avgLowPrice')}
              />
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Profit</div>
            <div
              className={`stat-value ${
                profit > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {numeral(latest.low - latest.high).format('0,0')}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Volume</div>
            <div className="stat-value">{numeral(volume).format('0,0')}</div>
          </div>
        </div>
        <div className="stats stats-vertical sm:stats-horizontal w-full bg-base-200">
          <div className="stat">
            <div className="stat-title">High alch</div>
            <div className="stat-value">{numeral(ha).format('0,0')}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Low alch</div>
            <div className="stat-value">{numeral(la).format('0,0')}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Buy limit</div>
            <div className="stat-value">{numeral(limit).format('0,0')}</div>
          </div>
        </div>
      </div>
    </Container>
  );
}
