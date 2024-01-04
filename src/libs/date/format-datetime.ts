import { formatDate } from './format-date';
import { formatTime } from './format-time';

export function formatDatetime(date: Date | number | string) {
  date = (date instanceof Date) ? date : new Date(date);
  return `${formatDate(date)} ${formatTime(date)}`;
}
