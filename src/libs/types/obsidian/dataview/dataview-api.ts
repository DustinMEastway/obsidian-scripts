import { ObsidianPage } from '../obsidian-page';
import { ObsidianPageLink } from '../obsidian-page-link';
import { DataArray } from './data-array';

export type DataviewApi = {
  page<T>(
    query: string | ObsidianPageLink
  ): ObsidianPage<T>;

  pages<T>(query: string): DataArray<T>;

  table(
    headers: string[],
    data: unknown[][]
  ): void;
};
