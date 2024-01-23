import { ObsidianPage } from '../obsidian-page';
import { ObsidianPageLink } from '../obsidian-page-link';
import { DataviewQuerier } from './dataview-querier';

export type DataviewApi = {
  page<T>(
    query: string | ObsidianPageLink
  ): ObsidianPage<T>;

  pages<T>(query: string): DataviewQuerier<T>;

  table(
    headers: string[],
    data: unknown[][]
  ): void;
};
