import { getApolloRef } from './get-apollo-ref';
import { ApolloRef } from './types';

export function getApolloRefFactory(
  apolloState: Record<string, unknown>
): <T>(refOrEntity: T | ApolloRef) => T {
  return (refOrEntity) => {
    return getApolloRef(apolloState, refOrEntity);
  }
}
