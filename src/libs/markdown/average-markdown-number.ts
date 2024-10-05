import { average } from '../number';
import { MarkdownNumber } from './types';

export type AverageMarkdownNumberConfig<T> = {
  key: keyof(T) | ((item: T) => MarkdownNumber);
};

/** Average @see MarkdownNumber values. */
export function averageMarkdownNumber(
  items: MarkdownNumber[],
  config?: Omit<AverageMarkdownNumberConfig<MarkdownNumber>, 'key'>
): MarkdownNumber;
export function averageMarkdownNumber<T>(
  items: T[],
  config: AverageMarkdownNumberConfig<T>
): MarkdownNumber;
export function averageMarkdownNumber<T>(
  items: T[],
  {
    key = (item: T) => {
      // key is only unset for MarkdownNumber items.
      return item as MarkdownNumber;
    }
  }: (
    Omit<AverageMarkdownNumberConfig<T>, 'key'>
    & { key?: AverageMarkdownNumberConfig<T>['key'] }
  ) = {}
): MarkdownNumber {
  const getValue = (typeof key === 'function') ? key : (
    (item: T) => {
      return item[key] as MarkdownNumber;
    }
  );
  const ratings = items.map((item) => {
    const rating = getValue(item);
    return (rating === 'null') ? null : rating;
  }).filter((rating) => {
    return rating != null;
  });

  return (!ratings.length) ? 'null' : average(ratings);
}
