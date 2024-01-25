import { ObsidianPage } from '../obsidian-page';
import { DataviewSortOrder } from './dataview-sort-order';

export type DataviewQuerier<T> = (
  Array<ObsidianPage<T>>
  & {
    limit(count: number): DataviewQuerier<T>;

    sort(
      sorter: (page: ObsidianPage<T>) => number,
      order: DataviewSortOrder
    ): DataviewQuerier<T>;

    where(
      predicate: (page: ObsidianPage<T>) => boolean
    ): DataviewQuerier<T>;
  }
);
