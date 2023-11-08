export type RawYoutubeChannel = {
  id: string;
  snippet: {
    customUrl: string;
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
  brandingSettings: {
    image: {
      bannerExternalUrl: string;
    };
  };
};
