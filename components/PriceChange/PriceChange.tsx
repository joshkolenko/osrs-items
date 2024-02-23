import { formatNumber } from '@/util/format-number';

export type PriceChangeProps = {
  latest: number;
  previous: number;
};

export default function PriceChange({ latest, previous }: PriceChangeProps) {
  const change = latest - previous;
  const changePercentage = (change / latest) * 100;

  const formattedChange = formatNumber(Math.abs(change));

  return (
    <div>
      {change > 0 ? (
        <span className="text-green-600">{'▲ ' + formattedChange}</span>
      ) : change < 0 ? (
        <span className="text-red-600">{'▼ ' + formattedChange}</span>
      ) : (
        'No change '
      )}{' '}
      {change ? ` (${changePercentage.toFixed(2)}%)` : ''}
    </div>
  );
}
