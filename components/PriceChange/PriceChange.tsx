import numeral from 'numeral';

export type PriceChangeProps = {
  latest: number;
  previous: number;
};

export default function PriceChange({ latest, previous }: PriceChangeProps) {
  const change = latest - previous;
  const changePercentage = (change / latest) * 100;

  const formattedChange = numeral(Math.abs(change)).format('0,0');

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
