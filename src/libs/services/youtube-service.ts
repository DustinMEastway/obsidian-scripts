import { formatDatetime } from '@/date';
import { createMarkdownLink } from '@/markdown';
import {
  TimeInMs,
  convertTimestamp
} from '@/number';
import { NoteFolder, createError } from '@/obsidian';
import { youtubeUrl } from './constants';
import { HttpService } from './http-service';
import {
  RawYoutubeChannel,
  RawYoutubeMediaType,
  RawYoutubeSearchItem,
  RawYoutubeVideo,
  RawYoutubeVideoV2,
  RawYoutubeVideoV2MarkerKey,
  YoutubeChannel,
  YoutubeMediaType,
  YoutubePage,
  YoutubeSearchItem,
  YoutubeVideo
} from './types';

const rawDataSearch = /ytInitialData\s*=\s*({[\s\S]+?});\s*<\/script>/;
const mediaTypeBackMap = new Map([
  [YoutubeMediaType.channel, RawYoutubeMediaType.channel],
  [YoutubeMediaType.video, RawYoutubeMediaType.video]
]);

export class YoutubeService {
  constructor(
    private _apiHttpService: HttpService,
    private _baseHttpService: HttpService,
    private _mediaType: YoutubeMediaType
  ) {
    // Intentionally left blank.
  }

  static createService({
    apiKey,
    apiUrl,
    mediaType
  }: {
    apiKey: string;
    apiUrl: string;
    mediaType: YoutubeMediaType;
  }): YoutubeService {
    return new YoutubeService(
      new HttpService(
        apiUrl,
        [(requestConfig) => {
          requestConfig.query ??= {};
          requestConfig.query.key = apiKey;
          return requestConfig;
        }]
      ),
      new HttpService(youtubeUrl),
      mediaType
    );
  }

  async getChannel(id: string): Promise<YoutubeChannel | null> {
    const channels = (await this._apiHttpService.fetchJson<
      YoutubePage<RawYoutubeChannel>
    >({
      query: {
        id,
        part: 'brandingSettings,id,snippet'
      },
      url: 'channels'
    })).items ?? [];

    return (channels.length) ? (
      this._convertChannel(channels[0])
    ) : null;
  }

  async getVideo(id: string): Promise<YoutubeVideo | null> {
    const videos = (
      await this._apiHttpService.fetchJson<YoutubePage<RawYoutubeVideo>>({
        query: {
          id,
          part: 'id,snippet'
        },
        url: 'videos'
      })
    ).items;
    if (videos.length !== 1) {
      throw new Error(`Expected 1 video but got ${videos.length}`);
    }

    const video = videos[0];
    const videoData = JSON.parse(
      rawDataSearch.exec(
        await this._baseHttpService.fetch({ url: `watch?v=${id}` })
      )?.[1] ?? 'null'
    ) as RawYoutubeVideoV2;

    return (video) ? (
      this._convertVideo(
        video,
        videoData
      )
    ) : null;
  }

  async search(query: string): Promise<YoutubeSearchItem[]> {
    return ((await this._apiHttpService.fetchJson<
      YoutubePage<RawYoutubeSearchItem>
    >({
      query: {
        maxResults: 10,
        part: 'snippet',
        q: query,
        type: this._convertMediaTypeBack(this._mediaType)
      },
      url: 'search'
    })).items ?? []).map((item) => {
      return this._convertSearch(item);
    });
  }

  private _convertChannel(
    channel: RawYoutubeChannel
  ): YoutubeChannel {
    const {
      id,
      snippet: {
        customUrl,
        localized: {
          description,
          title
        },
        thumbnails: {
          default: {
            url: defaultThumbnail
          },
          high: {
            url: highThumbnail
          }
        }
      },
      brandingSettings: {
        image: {
          bannerExternalUrl
        }
      }
    } = channel;

    return {
      banner: bannerExternalUrl,
      description,
      id,
      url: `${youtubeUrl}/${customUrl}`,
      thumbnail: highThumbnail ?? defaultThumbnail,
      title
    };
  }

  private _convertMediaTypeBack(
    mediaType: YoutubeMediaType
  ): RawYoutubeMediaType {
    const rawMediaType = mediaTypeBackMap.get(mediaType);
    if (rawMediaType) {
      return rawMediaType;
    }

    throw createError(
      `Unable to convert media type '${mediaType}'.`
    );
  }

  private _convertSearch(search: RawYoutubeSearchItem): YoutubeSearchItem {
    const id = Object.entries(search.id).find(([key]) => {
      return key === 'id' || key.endsWith('Id');
    })![1];
    const {
      snippet: {
        description,
        title
      }
    } = search;

    return {
      description,
      id,
      title
    };
  }

  private _convertVideo(
    video: RawYoutubeVideo,
    videoData: RawYoutubeVideoV2
  ): YoutubeVideo {
    const {
      id,
      snippet: {
        channelTitle,
        localized: {
          title
        },
        thumbnails: {
          default: {
            url: defaultThumbnail
          },
          high: {
            url: highThumbnail
          }
        }
      }
    } = video;
    const url = `${youtubeUrl}/watch?v=${id}`;
    const { localized, publishedAt } = video.snippet;
    const { description } = localized;
    const { markersMap } = videoData.playerOverlays.playerOverlayRenderer.decoratedPlayerBarRenderer?.decoratedPlayerBarRenderer.playerBar.multiMarkersPlayerBarRenderer ?? {};
    const chapters = markersMap?.find(({ key }) => {
      return (
        key === RawYoutubeVideoV2MarkerKey.autoChapters
        || key === RawYoutubeVideoV2MarkerKey.descriptionChapters
      );
    })?.value?.chapters?.map(({
      chapterRenderer: {
        timeRangeStartMillis: timeInMs,
        title: { simpleText }
      }
    }) => {
      const timeInSeconds = Math.round(timeInMs / TimeInMs.seconds);
      return `## ${simpleText} ([${convertTimestamp(timeInMs)}](${url}&t=${timeInSeconds}))`;
    }).join('\n\n') ?? '';

    return {
      channel: channelTitle,
      channelLink: createMarkdownLink(
        NoteFolder.youTubeChannel,
        channelTitle
      ),
      chapters: (chapters) ? `\n\n${chapters}` : '',
      description: (description) ? `\n\n${description}` : '',
      id,
      publishedOn: formatDatetime(publishedAt),
      thumbnail: highThumbnail ?? defaultThumbnail,
      title,
      url
    };
  }
}
