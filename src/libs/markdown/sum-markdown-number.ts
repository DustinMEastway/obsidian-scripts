import { sum } from '../number';
import { MarkdownNumber } from './types';

export type SumMarkdownNumberConfig<T> = {
  key: keyof(T) | ((item: T) => MarkdownNumber);
};

/** Sum @see MarkdownNumber values. */
export function sumMarkdownNumber(
  items: MarkdownNumber[],
  config?: Omit<SumMarkdownNumberConfig<MarkdownNumber>, 'key'>
): MarkdownNumber;
export function sumMarkdownNumber<T>(
  items: T[],
  config: SumMarkdownNumberConfig<T>
): MarkdownNumber;
export function sumMarkdownNumber<T>(
  items: T[],
  {
    key = (item: T) => {
      // key is only unset for MarkdownNumber items.
      return item as MarkdownNumber;
    }
  }: (
    Omit<SumMarkdownNumberConfig<T>, 'key'>
    & { key?: SumMarkdownNumberConfig<T>['key'] }
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

  return (!ratings.length) ? 'null' : sum(ratings);
}
