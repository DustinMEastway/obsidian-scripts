import { pad } from '../string';

export function formatDate(date: Date | number | string) {
  date = (date instanceof Date) ? date : new Date(date);
  return [
    pad(date.getUTCFullYear(), 4, { char: '0' }),
    pad(date.getUTCMonth() + 1, 2, { char: '0' }),
    pad(date.getUTCDate(), 2, { char: '0' })
  ].join('-');
}
