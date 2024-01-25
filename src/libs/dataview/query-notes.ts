import {
  DataviewApi,
  DataviewQuerier,
  DataviewSortOrder
} from '@/types';
import { DataviewSortConfig, DataviewValueGetter } from './types';

export type QueryNotesConfig<T> = {
  limit?: number;
  sort?: DataviewSortConfig<T>[];
  source: DataviewQuerier<T> | string;
  where?: DataviewValueGetter<T, boolean>;
};

export function queryNotes<T>(
  dataviewApi: DataviewApi,
  {
    limit,
    sort,
    source,
    where
  }: QueryNotesConfig<T>
): DataviewQuerier<T> {
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

  if (typeof limit === 'number') {
    pages = pages.limit(limit);
  }

  return pages;
}
