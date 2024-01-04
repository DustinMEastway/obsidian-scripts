import { pad } from '../string';

export function formatDate(date: Date | number | string) {
  date = (date instanceof Date) ? date : new Date(date);
  return [
    pad(date.getFullYear(), 4, { char: '0' }),
    pad(date.getMonth() + 1, 2, { char: '0' }),
    pad(date.getDate(), 2, { char: '0' })
  ].join('-');
}
