'use client';

import type { Item, Timeseries, TimeseriesData } from '@/types';

import { formatNumber } from '@/util/format-number';

import PriceChange from '../PriceChange';
import AlchDiff from '../AlchDiff';

export default function Stats({
  item,
  prices = {},
}: {
  item: Item;
  prices: TimeseriesData;
}) {
  const buy = item.price.high;
  const sell = item.price.low;
  const margin = buy - sell;

  function getLastPrice(arr: Timeseries[], prop: keyof Timeseries) {
    const reversed = arr.toReversed();
    const point = reversed.find((point: Timeseries) => point[prop] !== null);

    if (!point) return null;

    return point[prop];
  }

  const { daily } = prices;

  if (!daily) return null;

  const previousBuy = getLastPrice(daily, 'avgHighPrice');
  const previousSell = getLastPrice(daily, 'avgLowPrice');

  return (
    <div className="bg-base-200 p-5 rounded-md">
      <div className="grid md:grid-cols-2 gap-5 items-start">
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">Buy Price</div>
            <div className="stat-value">{formatNumber(buy)}</div>
            {previousBuy && (
              <div className="stat-desc">
                <PriceChange latest={buy} previous={previousBuy} />
              </div>
            )}
          </div>
          <div className="stat">
            <div className="stat-title">Sell Price</div>
            <div className="stat-value">{formatNumber(sell)}</div>
            {previousSell && (
              <div className="stat-desc">
                <PriceChange latest={sell} previous={previousSell} />
              </div>
            )}
          </div>
          <div className="stat">
            <div className="stat-title">Margin</div>
            <div
              className={
                'stat-value ' +
                (margin > 0
                  ? 'text-green-500'
                  : margin < 0
                  ? 'text-red-500'
                  : '')
              }
            >
              {formatNumber(margin)}
            </div>
            <div className="stat-desc">No change</div>
          </div>
          <div className="stat">
            <div className="stat-title">Volume</div>
            <div className="stat-value">{formatNumber(item.volume)}</div>
          </div>
        </div>
        <div className="stats stats-vertical shadow">
          <div className="stat">
            <div className="stat-title">High Alch</div>
            <div className="stat-value">{formatNumber(item.highalch)}</div>
            <div className="stat-desc">
              <AlchDiff sell={sell} alch={item.highalch} />
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Low Alch</div>
            <div className="stat-value">{formatNumber(item.lowalch)}</div>
            <div className="stat-desc">
              <AlchDiff sell={sell} alch={item.lowalch} />
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Limit</div>
            <div className="stat-value">{formatNumber(item.limit)}</div>
            <div className="stat-desc">Per 4 hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
