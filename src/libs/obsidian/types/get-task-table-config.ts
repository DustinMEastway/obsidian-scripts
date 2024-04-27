import { GetTaskTableFilterType } from '../constants';

export type GetTaskTableConfig<T> = {
  columns?: {
    /** Whether due date should be displayed (@default false). */
    dueOn?: boolean;
    /** Property name for ratings from external sources such as IMDB. */
    externalRating?: string & keyof(T);
    /** Property name for ratings from user of this vault. */
    internalRating?: string & keyof(T);
    /** Whether priority should be displayed (@default false). */
    priority?: boolean;
    /** Whether status should be displayed (@default false). */
    status?: boolean;
  };
  filterType: GetTaskTableFilterType;
  folder: string;
  /** @deprecated Use @see page.size instead. */
  limit?: number;
  /** Pagination for the query. */
  page?: {
    /** Page number (starting at 0) to query. */
    number?: number;
    /** Size of each page. */
    size: number;
  };
};
