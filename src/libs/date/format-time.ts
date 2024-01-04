import { pad } from '../string';

export function formatTime(date: Date | number | string) {
  date = (date instanceof Date) ? date : new Date(date);
  let hours = date.getHours() % 12;
  if (hours === 0) {
    hours = 12;
  }

  return [
    pad(hours, 2, { char: '0' }),
    pad(date.getMinutes(), 2, { char: '0' })
  ].join(':') + ` ${(date.getHours() < 12) ? 'AM' : 'PM'}`;
}
