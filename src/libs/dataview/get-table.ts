import { DataviewApi } from '@/types';
import { QueryNotesConfig, queryNotes } from './query-notes';
import { DataviewColumnConfig } from './types';

export type GetTableConfig<T> = (
  QueryNotesConfig<T>
  & {
    columns: DataviewColumnConfig<T>[];
  }
);

export async function getTable<T>(
  dataviewApi: DataviewApi,
  {
    columns,
    ...queryConfig
  }: GetTableConfig<T>,
): Promise<void> {
  const pages = queryNotes(dataviewApi, queryConfig);
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
