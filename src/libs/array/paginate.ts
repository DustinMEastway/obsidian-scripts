import { DataArray } from '@/types';

export type PaginationConfig = {
  /** Page number (starting at 0) to query. */
  number?: number;
  /** Size of each page. */
  size: number;
};

export function paginate<T>(
  items: DataArray<T>,
  config: PaginationConfig | undefined | null
): DataArray<T>;
export function paginate<T>(
  items: T[],
  config: PaginationConfig | undefined | null
): T[];
export function paginate<T>(
  items: DataArray<T> | T[],
  config: PaginationConfig | undefined | null
): DataArray<T> | T[] {
  if (!config) {
    return items;
  }

  let {
    number,
    size
  } = config;
  if (typeof size !== 'number' || size < 0) {
    return items;
  }

  number = (
    typeof number === 'number'
    && number >= 0
  ) ? number : 0;
  const start = number * size;
  return items.slice(
    start,
    start + size
  );
}
