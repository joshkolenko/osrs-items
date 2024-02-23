'use client';

import { formatNumber } from '@/util/format-number';

import useItem from '@/hooks/useItem';

export default function AlchDiff({
  sell,
  alch,
}: {
  sell: number;
  alch: number;
}) {
  const natureRune = useItem('Nature rune');
  const natureRunePrice = natureRune.price;

  const profit = alch - sell - natureRunePrice.low;
  const profitPercentage = (profit / sell) * 100;
  const formattedProfit = formatNumber(profit);

  return (
    <div>
      {profit > 0 ? (
        <span className="text-green-600">{'+' + formattedProfit}</span>
      ) : profit < 0 ? (
        <span className="text-red-600">{formattedProfit}</span>
      ) : (
        'No profit '
      )}{' '}
      {profit ? ` coins (${profitPercentage.toFixed(2)}%)` : ''}
    </div>
  );
}
