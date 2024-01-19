import { RawIgdbSearchGame } from "./raw-igdb-search-game";

export type RawIgdbGameSeries = {
  id: number;
  games: RawIgdbSearchGame[];
  name: string;
  url: string;
}
