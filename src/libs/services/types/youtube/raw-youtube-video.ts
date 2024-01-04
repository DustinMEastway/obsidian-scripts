export type RawYoutubeVideo = {
  id: string;
  snippet: {
    channelTitle: string;
    localized: {
      description: string;
      title: string;
    };
    publishedAt: string;
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

export enum RawYoutubeVideoV2MarkerKey {
  animationAnnotationMarkers = 'ANIMATION_ANNOTATION_MARKERS',
  autoChapters = 'AUTO_CHAPTERS',
  descriptionChapters = 'DESCRIPTION_CHAPTERS'
};

export type RawYoutubeVideoV2Marker = (
  {
    key: (
      RawYoutubeVideoV2MarkerKey.autoChapters
      | RawYoutubeVideoV2MarkerKey.descriptionChapters
    );
    value: {
      chapters: {
        chapterRenderer: {
          timeRangeStartMillis: number;
          title: {
            simpleText: string;
          };
        };
      }[];
      trackingParams: string;
    };
  } | {
    key: RawYoutubeVideoV2MarkerKey.animationAnnotationMarkers,
    value: {
      chapters?: never;
      markers: {
        markerRenderer: {
          timeRangeStartMillis: number;
          title: unknown;
        };
      }[];
      trackingParams: string;
    };
  }
);

export type RawYoutubeVideoV2 = {
  playerOverlays: {
    playerOverlayRenderer: {
      decoratedPlayerBarRenderer: {
        // Yes they have a property with the same name twice.
        decoratedPlayerBarRenderer: {
          playerBar: {
            multiMarkersPlayerBarRenderer: {
              markersMap: RawYoutubeVideoV2Marker[];
            }
          }
        }
      }
    }
  }
};
