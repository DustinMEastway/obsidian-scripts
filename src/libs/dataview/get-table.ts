import { DataviewApi, DataviewSortOrder } from '@/types';
import { DataviewValueGetter } from './types';

export type GetTableConfig<T> = {
  columns: {
    property: DataviewValueGetter<T, any>;
    title: string;
  }[];
  fileQuery: string;
  limit?: number;
  sort?: {
    desc?: boolean;
    property: DataviewValueGetter<T, any>;
  }[];
  where?: DataviewValueGetter<T, boolean>;
};

export async function getTable<T>(
  dataviewApi: DataviewApi,
  {
    columns,
    fileQuery,
    limit,
    sort,
    where
  }: GetTableConfig<T>
) {
  let pages = dataviewApi.pages<T>(fileQuery);

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

  dataviewApi.table(
    columns.map((column) => {
      return column.title;
    }),
    await Promise.all(
      pages.map(async (page) => {
        return columns.map((column) => {
          return column.property(page);
        });
      })
    )
  );
}
