import { ObsidianPage } from '../obsidian-page';
import { DataviewSortOrder } from './dataview-sort-order';

type ArrayExtensions<T> = {
  filter(predicate: (item: T) => boolean): DataArray<T>;

  limit(count: number): DataArray<T>;

  slice(start?: number, end?: number): DataArray<T>;

  sort(
    sorter: (page: ObsidianPage<T>) => number | string,
    order: DataviewSortOrder
  ): DataArray<T>;

  where(
    predicate: (page: ObsidianPage<T>) => boolean
  ): DataArray<T>;
};

/**
 * Obsidaian Dataview extension of an array.
 *
 * @note [Official documentation](https://blacksmithgu.github.io/obsidian-dataview/api/data-array/)
 */
export type DataArray<T> = (
  Omit<Array<ObsidianPage<T>>, keyof(ArrayExtensions<T>)>
  & ArrayExtensions<T>
);
