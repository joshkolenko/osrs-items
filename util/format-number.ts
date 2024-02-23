import numeral from 'numeral';

export function formatNumber(number: number) {
  return numeral(number).format('0,0');
}
