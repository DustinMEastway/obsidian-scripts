export type RawGoodreadsBookSeriesNumWorks = {
  currentPageNumber: number;
  numWorks: number;
  perPage: number;
};

export module RawGoodreadsBookSeriesNumWorks {
  export function is(
    data: RawGoodreadsBookSeriesData
  ): data is RawGoodreadsBookSeriesNumWorks {
    return 'numWorks' in data;
  }
}