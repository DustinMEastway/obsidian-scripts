import { BaseTaskNote, MetadataNote } from '@/obsidian';
import { StringCase, convertCase } from '@/string';
import { ObsidianPage, ObsidianPageLink } from '@/types';
import { getTable } from './get-table';
import { queryNotes } from './query-notes';
import {
  DataviewSortConfig,
  DataviewColumnConfig,
  GroupedApis
} from './types';

export enum GetTaskTableFilterType {
  abandoned = 'Abandoned',
  toDo = 'To Do',
  top = 'Top'
}

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
  limit?: number;
};

type TaskNote = (
  BaseTaskNote
  & {
    cover?: string;
    prior?: ObsidianPageLink;
  }
);

export async function getTaskTable<T extends TaskNote>(
  apis: GroupedApis,
  config: GetTaskTableConfig<T>
): Promise<void> {
  const {
    dataviewApi,
    obsidianApi
  } = apis;
  const {
    folder,
    columns,
    limit
  } = config;
  const {
    'metadata-menu': { api: metadataMenuApi }
  } = obsidianApi.plugins.plugins;

  const filter = getFilter(apis, config);

  const pages = queryNotes(dataviewApi, {
    limit,
    source: `"${folder}"`,
    sort: filterConfigs<DataviewSortConfig<T>>([
      ((!columns?.priority) ? null : {
        desc: true,
        property: (page) => {
          return dataviewApi.page<MetadataNote>(page.priority).order;
        }
      }),
      ((!columns?.dueOn) ? null : {
        property: (page) => {
          // Default date to high number to put it last in the list.
          return page.dueOn ?? '9999-99-99';
        }
      }),
      ((!columns?.status) ? null : {
        desc: true,
        property: (page) => {
          return dataviewApi.page<MetadataNote>(page.status).order;
        }
      }),
      ((!columns?.internalRating) ? null : {
        desc: true,
        property: (page) => {
          return page[columns.internalRating!];
        }
      }),
      ((!columns?.externalRating) ? null : {
        desc: true,
        property: (page) => {
          return page[columns.externalRating!];
        }
      })
    ]),
    where: ((page) => {
      return (
        page.file.folder === folder
        && filter(page)
      );
    })
  });

  let includeCover = false;
  if (
    pages.length
    && 'cover' in pages[0]
  ) {
    includeCover = true;
  }

  await getTable(dataviewApi, {
    columns: filterConfigs<DataviewColumnConfig<T>>([
      ((!includeCover) ? null : {
        property: (page) => {
          return `![|200](${page.cover})`;
        },
        title: 'Cover'
      }),
      {
        property: (page) => {
          return page.file.link;
        },
        title: 'Name'
      },
      ((!columns?.status) ? null : {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, 'status');
        },
        title: 'Status'
      }),
      ((!columns?.priority) ? null : {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, 'priority');
        },
        title: 'Priority'
      }),
      ((!columns?.dueOn) ? null : {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, 'dueOn');
        },
        title: 'Due On'
      }),
      ((!columns?.internalRating) ? null : {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, columns.internalRating!);
        },
        title: 'Rating'
      }),
      ((!columns?.externalRating) ? null : {
        property: (page) => {
          return page[columns.externalRating!];
        },
        title: convertCase(columns.externalRating, StringCase.title)
      })
    ]),
    source: pages
  });
}

function filterConfigs<T>(items: (T | null)[]): T[] {
  return items.filter((item) => {
    return item != null;
  }) as T[];
}

function getFilter<T extends TaskNote>(
  {
    dataviewApi
  }: GroupedApis,
  {
    filterType,
    columns: {
      internalRating
    } = {}
  }: GetTaskTableConfig<T>
): (page: ObsidianPage<T>) => boolean {
  switch (filterType) {
    case GetTaskTableFilterType.abandoned:
      return (page) => {
        return page.tags?.includes('abandoned');
      };
    case GetTaskTableFilterType.toDo:
      return (page) => {
        return (
          !page.tags?.includes('abandoned')
          && (
            page.status.display !== 'Done'
            || page.tags?.includes('redo')
          )
          && (
            !page.prior
            || dataviewApi.page<T>(page.prior).status.display === 'Done'
          )
        );
      };
    case GetTaskTableFilterType.top:
      return (page) => {
        return (internalRating) ? page[internalRating] != null : (
          page.status.display === 'Done'
        );
      };
    default: {
      const neverType: never = filterType;
      throw new Error(`Unable to filter type '${neverType}'`);
    }
  } 
}
