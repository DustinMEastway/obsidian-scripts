import { pad } from '@/string';
import { TimeInMs } from './time-in-ms';

export function convertTimestamp(timeInMs: number): string {
  const hours = Math.floor(timeInMs / TimeInMs.hours);
  const minutes = Math.floor((timeInMs % TimeInMs.hours) / TimeInMs.minutes);
  const seconds = Math.round((timeInMs % TimeInMs.minutes) / TimeInMs.seconds);
  const times = [
    minutes,
    seconds
  ];

  if (hours > 0) {
    times.unshift(hours);
  }

  return times.map((time) => {
    return pad(time, 2, { char: '0' })
  }).join(':');
}
