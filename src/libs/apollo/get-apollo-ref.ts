import { ApolloRef } from './types';

export function getApolloRef<T>(
  apolloState: Record<string, unknown>,
  refOrEntity: T | ApolloRef
): T {
  if (
    !refOrEntity
    || typeof refOrEntity !== 'object'
    || !('__ref' in refOrEntity)
  ) {
    return refOrEntity;
  }

  return apolloState[refOrEntity.__ref] as T;
}
