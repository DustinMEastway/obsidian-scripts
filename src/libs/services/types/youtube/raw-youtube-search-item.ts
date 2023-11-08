import { RawYoutubeKind } from './raw-youtube-kind';

export type RawYoutubeSearchItem = {
  id: {
    kind: RawYoutubeKind;
  } & (
    { channelId: string; }
    | { videoId: string; }
  );
  snippet: {
    description: string;
    title: string;
  };
};
