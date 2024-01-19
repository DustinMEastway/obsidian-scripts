import { pad } from '@/string';
import { DateFormat } from './date-format';

export type FormatDateConfig = {
  format?: DateFormat;
}

/** Formats a date into a human readable date, time, or datetime. */
export function formatDate(
  date: Date | number | string,
  {
    format = DateFormat.date
  }: FormatDateConfig = {}
): string {
  date = (date instanceof Date) ? date : new Date(date);
  switch (format) {
    case DateFormat.date:
      return innerFormatDate(date);
    case DateFormat.time:
      return innerFormatTime(date);
    case DateFormat.datetime:
      return `${innerFormatDate(date)} ${innerFormatTime(date)}`;
  }
}

function innerFormatDate(date: Date): string {
  return [
    pad(date.getFullYear(), 4, { char: '0' }),
    pad(date.getMonth() + 1, 2, { char: '0' }),
    pad(date.getDate(), 2, { char: '0' })
  ].join('-');
}

function innerFormatTime(
  date: Date | number | string
): string {
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
