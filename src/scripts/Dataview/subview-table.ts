import {
  DataviewSortOrder,
  ViewNote,
  checkDisplayColumns,
  filterNull,
  getNoteName
} from '@';

declare const input: {
  /** Order for the name sort of subviews to use @default DataviewSortOrder.asc. */
  nameOrder?: DataviewSortOrder;
  /** Source to find notes from @default '"View"'. */
  source?: string;
};

const current = dv.current();
const pages = dv.pages<ViewNote>(input?.source ?? '"View"').filter((page) => {
  return page.from?.some((link) => {
    return link.path === current.file.path;
  });
});

const {
  displayDiscription,
  displayPrice,
  displayUrl
} = checkDisplayColumns(pages, {
  displayDiscription: 'description',
  displayPrice: 'price',
  displayUrl: 'url'
});

dv.table(
  filterNull([
    ((displayPrice) ? 'Price' : null),
    'Name',
    ((displayDiscription) ? 'Description' : null),
    ((displayUrl) ? 'Link' : null),
  ]),
  pages.sort((page) => {
    return page.order ?? 0;
  }, DataviewSortOrder.desc).sort((page) => {
    return getNoteName(page);
  }, input?.nameOrder ?? DataviewSortOrder.asc).map((page) => {
    return filterNull([
      ((displayPrice) ? (page as any).price ?? '' : null),
      `[[${page.file.path}|${getNoteName(page)}]]`,
      ((displayDiscription) ? page.description ?? '' : null),
      ((displayUrl) ? (
        ((page as any).url) ? `[Buy](${(page as any).url})` : ''
      ) : null)
    ]);
  })
);
