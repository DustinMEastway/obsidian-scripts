import { ObsidianPageLink } from '@/types';
import { getTable } from './get-table';
import { queryNotes } from './query-notes';
import { BaseTaskNote, MetadataNote } from '@/obsidian';
import { StringCase, convertCase } from '@/string';
import {
  DataviewSortConfig,
  DataviewColumnConfig,
  GroupedApis
} from './types';

export type GetTaskTableConfig<T> = {
  columns?: {
    /** Whether due date should be displayed (@default false). */
    dueOn?: boolean;
    /** Property name for ratings from external sources such as IMDB. */
    externalRating?: string & keyof(T);
    /** Property name for ratings from user of this vault. */
    internalRating?: string & keyof(T);
  };
  limit?: number;
  source: string;
};

type TaskNote = (
  BaseTaskNote
  & {
    cover?: string;
    prior?: ObsidianPageLink;
  }
);

const folderSearch = /"((\w+\/)*\w+)"/;

export async function getTaskTable<T extends TaskNote>(
  {
    dataviewApi,
    obsidianApi
  }: GroupedApis,
  {
    columns,
    limit,
    source
  }: GetTaskTableConfig<T>
): Promise<void> {
  const {
    'metadata-menu': { api: metadataMenuApi }
  } = obsidianApi.plugins.plugins;

  const folder = folderSearch.exec(source)?.[1] ?? null;
  const pages = queryNotes(dataviewApi, {
    limit,
    source,
    sort: filterConfigs<DataviewSortConfig<T>>([
      {
        desc: true,
        property: (page) => {
          return dataviewApi.page<MetadataNote>(page.priority).order;
        }
      },
      ((!columns?.dueOn) ? null : {
        property: (page) => {
          // Default date to high number to put it last in the list.
          return page.dueOn ?? '9999-99-99';
        }
      }),
      {
        desc: true,
        property: (page) => {
          return dataviewApi.page<MetadataNote>(page.status).order;
        }
      },
      ((!columns?.externalRating) ? null : {
        desc: true,
        property: (page) => {
          return page[columns.externalRating!];
        }
      })
    ]),
    where: ((page) => {
      return (
        (
          !folder
          || page.file.folder === folder
        )
        && (
          page.status.display !== 'Done'
          || page.tags?.includes('redo')
        )
        && (
          !page.prior
          || dataviewApi.page<T>(page.prior).status.display === 'Done'
        )
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
      {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, 'status');
        },
        title: 'Status'
      },
      {
        property: (page) => {
          return metadataMenuApi.fieldModifier(dataviewApi, page, 'priority');
        },
        title: 'Priority'
      },
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