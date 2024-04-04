import { ObsidianPage } from '../obsidian-page';
import { DataviewSortOrder } from './dataview-sort-order';

/**
 * Obsidaian Dataview extension of an array.
 *
 * @note [Official documentation](https://blacksmithgu.github.io/obsidian-dataview/api/data-array/)
 */
export type DataArray<T> = (
  Array<ObsidianPage<T>>
  & {
    limit(count: number): DataArray<T>;

    sort(
      sorter: (page: ObsidianPage<T>) => number,
      order: DataviewSortOrder
    ): DataArray<T>;

    where(
      predicate: (page: ObsidianPage<T>) => boolean
    ): DataArray<T>;
  }
);
