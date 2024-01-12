import { RawIgdbSearchGame } from "./raw-igdb-search-game";

export type RawIgdbGame = {
  cover: {
    id: number;
    url: string;
  };
  firstReleaseDate: number;
  franchises: {
    id: number;
    name: string;
  }[];
  gameEngines: {
    id: number;
    name: string;
  }[];
  genres: {
    id: number;
    name: string;
  }[];
  id: number;
  involvedCompanies: {
    company: {
      id: number;
      name: string;
    };
    developer: boolean;
    id: number;
    publisher: boolean;
  }[];
  name: string;
  platforms: {
    id: number;
    name: string;
  }[];
  remakes: RawIgdbSearchGame[];
  remasters: RawIgdbSearchGame[];
  similarGames: RawIgdbSearchGame[];
  summary: string;
  themes: {
    id: number;
    name: string;
  }[];
  totalRating?: number;
  url: string;
}
