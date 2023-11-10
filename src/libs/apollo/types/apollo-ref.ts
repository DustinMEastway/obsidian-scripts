export type ApolloRef<K extends string = string> = {
  __ref: `${K}${string}`;
}
