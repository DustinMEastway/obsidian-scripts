import { DataviewValueGetter } from './dataview-value-getter';

export type DataviewSortConfig<T> = {
  /** Whether it should sort in descending order (@default false). */
  desc?: boolean;
  /** Property to sort by. */
  property: DataviewValueGetter<T, any>;
};
