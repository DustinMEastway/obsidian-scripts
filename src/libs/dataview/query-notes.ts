import { PaginationConfig, paginate } from '@/array';
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
  page?: PaginationConfig;
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

  pages = paginate(pages, {
    ...page,
    // Fallback to deprecated limit property.
    size: page?.size ?? limit ?? -1
  });

  return pages;
}
