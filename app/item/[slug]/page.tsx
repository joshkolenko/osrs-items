import Container from '@/components/Container/Container';
import PriceChange from '@/components/PriceChange/PriceChange';

import { createItem } from '@/util/osrs-wiki';

import numeral from 'numeral';

export default async function Page({ params }: { params: { slug: string } }) {
  const title = decodeURIComponent(params.slug);

  // return <div>{title}</div>;

  const item = createItem(title);

  const latest = await item.getLatestPriceData();
  const daily = await item.getPriceData('24h');
  const volume = await item.getVolume();

  function getRecentPrice(prop: 'avgHighPrice' | 'avgLowPrice') {
    let recentPrice = 0;

    for (let i = daily.length - 1; i >= 0; i--) {
      const price = daily[i][prop];

      if (price !== null) {
        recentPrice = price;
        break;
      }
    }

    return recentPrice;
  }

  return (
    <Container className="py-12 sm:py-20">
      <h1 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6">{title}</h1>
      <div className="stats stats-vertical w-full lg:stats-horizontal shadow bg-base-200">
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
          <div className="stat-title">Volume</div>
          <div className="stat-value">{numeral(volume).format('0,0')}</div>
        </div>
      </div>
    </Container>
  );
}
