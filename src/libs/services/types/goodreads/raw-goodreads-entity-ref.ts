import { ApolloRef } from "@/apollo";

export type RawGoodreadsEntityRef<
  K extends string
> = ApolloRef<`${K}:kca://${string}`>;
