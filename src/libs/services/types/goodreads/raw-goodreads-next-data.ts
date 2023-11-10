import { RawGoodreadsApolloState } from './raw-goodreads-apollo-state';

export type RawGoodreadsNextData = {
  props: {
    pageProps: {
      apolloState: RawGoodreadsApolloState;
    };
  };
  query: {
    book_id: string;
  };
};
