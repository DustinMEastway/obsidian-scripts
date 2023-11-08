export type RawYoutubeVideo = {
  id: string;
  snippet: {
    channelTitle: string;
    localized: {
      description: string;
      title: string;
    };
    thumbnails: {
      default: {
        url: string;
      };
      high: {
        url: string;
      };
    };
  };
};
