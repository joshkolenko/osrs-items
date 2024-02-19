import Container from '@/components/Container/Container';
import PriceChange from '@/components/PriceChange/PriceChange';

import getItemData from '@/util/get-item-data';
import numeral from 'numeral';

export default async function Page({ params }: { params: { slug: string } }) {
  const itemData = await getItemData(params.slug);

  const { title, priceData } = itemData;
  const { latest, daily } = priceData;

  function getLastAvgHighPrice() {
    let lastAvgHighPrice = 0;

    for (let i = daily.length - 1; i >= 0; i--) {
      const avgHighPrice = daily[i].avgHighPrice;

      if (avgHighPrice !== null) {
        lastAvgHighPrice = avgHighPrice;
        break;
      }
    }

    return lastAvgHighPrice;
  }

  function getLastAvgLowPrice() {
    let lastAvgLowPrice = 0;

    for (let i = daily.length - 1; i >= 0; i--) {
      const avgLowPrice = daily[i].avgLowPrice;

      if (avgLowPrice !== null) {
        lastAvgLowPrice = avgLowPrice;
        break;
      }
    }

    return lastAvgLowPrice;
  }

  return (
    <Container>
      <h1>{title}</h1>
      <div className="stats stats-vertical lg:stats-horizontal shadow text-left bg-slate-800">
        <div className="stat">
          <div className="stat-title text-slate-500">Buy price</div>
          <div className="stat-value text-slate-400">
            {numeral(latest.high).format('0,0')} coins
          </div>
          <div className="stat-desc">
            <PriceChange
              latest={latest.high}
              previous={getLastAvgHighPrice()}
            />
          </div>
        </div>
        <div className="stat">
          <div className="stat-title text-slate-500">Sell price</div>
          <div className="stat-value text-slate-400">
            {numeral(latest.low).format('0,0')} coins
          </div>
          <div className="stat-desc">
            <PriceChange latest={latest.low} previous={getLastAvgLowPrice()} />
          </div>
        </div>
        <div className="stat">
          <div className="stat-title text-slate-500">Volume</div>
          <div className="stat-value text-slate-400">
            {numeral(itemData.volume).format('0,0')}
          </div>
        </div>
      </div>
    </Container>
  );
}
