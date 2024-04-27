import {
  DataviewApi,
  DataArray,
  DataviewSortOrder
} from '@/types';
import { DataviewSortConfig, DataviewValueGetter } from './types';

export type QueryNotesConfig<T> = {
  /** @deprecated Use @see page.size instead. */
  limit?: number;
  /** Pagination for the query. */
  page?: {
    /** Page number (starting at 0) to query. */
    number?: number;
    /** Size of each page. */
    size: number;
  };
  /** Properties to sort by in order of most to least importance. */
  sort?: DataviewSortConfig<T>[];
  /** Source notes to start querying off from. */
  source: DataArray<T> | string;
  /** Filter to apply to notes. */
  where?: DataviewValueGetter<T, boolean>;
};

export function queryNotes<T>(
  dataviewApi: DataviewApi,
  {
    limit,
    page,
    sort,
    source,
    where
  }: QueryNotesConfig<T>
): DataArray<T> {
  let pages = (typeof source === 'string') ? (
    dataviewApi.pages<T>(source)
  ) : source;

  if (where) {
    pages = pages.where(where);
  }

  sort?.reverse().forEach(({
    desc,
    property
  }) => {
    pages = pages.sort((page) => {
      return property(page);
    }, (desc) ? DataviewSortOrder.desc : DataviewSortOrder.asc);
  });

  let {
    number,
    // Fallback to deprecated limit property.
    size = limit
  } = page ?? {};
  if (
    typeof size === 'number'
    && size >= 0
  ) {
    number = (
      typeof number === 'number'
      && number >= 0
    ) ? number : 0;
    const start = number * size;
    pages = pages.slice(
      start,
      start + size
    );
  }

  return pages;
}
