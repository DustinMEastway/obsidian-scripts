import { DataArray, ObsidianPage } from '@/types';

export function checkDisplayColumns<T extends Record<string, string>>(
  pages: ObsidianPage<unknown>[] | DataArray<unknown>,
  columns: T
): Record<keyof(T), boolean> {
  const checkColumns: (keyof(T))[] = Object.keys(columns);
  const displayColumns: (keyof(T))[] = [];
  pages.forEach((page) => {
    for (let i = 0; i < checkColumns.length; ++i) {
      const columnName = checkColumns[i];
      const columnValue = columns[columnName];
      if (columnValue in page) {
        displayColumns.push(columnName);
        checkColumns.splice(i, 1);
        --i;
      }
    }
  });

  return Object.fromEntries([
    ...checkColumns.map((key) => {
      return [key, false]
    }),
    ...displayColumns.map((key) => {
      return [key, true]
    })
  ]);
}
