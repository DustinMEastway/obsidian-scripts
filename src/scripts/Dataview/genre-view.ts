import {
  BaseNote,
  DataviewSortOrder,
  GenreNote,
  ObsidianPageLink,
  getNoteName
} from '@';

declare const input: (
  /** Overrides at the input level. */
  GenreNote['queryConfig']
  & {
    /** Source to find notes from @default '"Database"'. */
    source?: string;
  }
);

const current = dv.current<GenreNote>();

let {
  limit,
  source
} = {
  ...current.queryConfig,
  ...input
};

const pages = dv.pages<BaseNote>(source ?? '"Database"').filter((page) => {
  return (
    'genre' in page
    && !!(page.genre as ObsidianPageLink[] | null)?.some((link) => {
      return link.path === current.file.path;
    })
  );
});

dv.table(
  [
    'Cover',
    'Name',
    'Rating',
    'Type'
  ],
  pages.sort((page) => {
    return getNoteName(page);
  }, DataviewSortOrder.asc).sort((page) => {
    return page.rating ?? 0;
  }, DataviewSortOrder.desc).limit(
    limit ??= 25
  ).map((page) => {
    return [
      (('cover' in page) ? `![|200](${page.cover})` : null),
      `[[${page.file.path}|${getNoteName(page)}]]`,
      page.rating,
      page.class
    ];
  })
);
