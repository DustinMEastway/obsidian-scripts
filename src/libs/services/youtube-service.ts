import { createMarkdownLink } from '@/markdown';
import { createError } from '@/obsidian';
import { youtubeUrl } from './constants';
import { HttpService } from './http-service';
import {
  RawYoutubeChannel,
  RawYoutubeMediaType,
  RawYoutubeSearchItem,
  RawYoutubeVideo,
  YoutubeChannel,
  YoutubeMediaType,
  YoutubePage,
  YoutubeSearchItem,
  YoutubeVideo
} from './types';

const chapterTimeSearch = /^(\d+(?::\d+)*) *[\-:]? +(.*) *|(.*?) *[\-:]? +(\d+(?::\d+)*) *$/;
const chaptersSearch = /((?: *\n?.* \d+(:\d+)+| *\n?\d+(:\d+)+ .*){2,})/mi;
const mediaTypeBackMap = new Map([
  [YoutubeMediaType.channel, RawYoutubeMediaType.channel],
  [YoutubeMediaType.video, RawYoutubeMediaType.video]
]);

export class YoutubeService {
  constructor(
    private _httpService: HttpService,
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
        null,
        [(requestConfig) => {
          requestConfig.url = `${apiUrl}/${requestConfig.url}`;
          requestConfig.query ??= {};
          requestConfig.query.key = apiKey;
          return requestConfig;
        }]
      ),
      mediaType
    );
  }

  async getChannel(id: string): Promise<YoutubeChannel | null> {
    const channels = (await this._httpService.fetchJson<
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
      await this._httpService.fetchJson<YoutubePage<RawYoutubeVideo>>({
        query: {
          id,
          part: 'id,snippet'
        },
        url: 'videos'
      })
    ).items ?? [];

    return (videos.length) ? (
      this._convertVideo(videos[0])
    ) : null;
  }

  async search(query: string): Promise<YoutubeSearchItem[]> {
    return ((await this._httpService.fetchJson<
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

  private _convertVideo(video: RawYoutubeVideo): YoutubeVideo {
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
    let { description } = video.snippet.localized;
    let chapters = '';
    const chaptersMatch = chaptersSearch.exec(description);
    if (chaptersMatch) {
      description = (
        description.slice(0, chaptersMatch.index).trim()
        + '\n\n'
        + description.slice(chaptersMatch.index + chaptersMatch[0].length).trim()
      );
      chapters = chaptersMatch[1].trim().split(/\s*\n\s*/).map((chapter) => {
        // There are multiple times and titles because they can be a the beginning or end.
        const [_, time1, title1, title2, time2] = chapterTimeSearch.exec(chapter) ?? [];
        const time = time1 ?? time2;
        const title = title1 ?? title2;
        const splitTime = time.split(':').reverse().map((t) => {
          return parseInt(t, 10);
        });

        if (
          splitTime.length < 1
          || splitTime.length > 3
          || splitTime.some((t) => isNaN(t) || t < 0)
        ) {
          throw createError('Chapter timestamps not formatted properly.');
        }

        const timeInSeconds = (
          // Seconds.
          splitTime[0]
          // Minutes.
          + (splitTime[1] ?? 0) * 60
          // Hours.
          + (splitTime[2] ?? 0) * 60 * 60
        );
        return `## ${title} ([${time}](${url}&t=${timeInSeconds}))`;
      }).join('\n\n');
    }

    return {
      channel: channelTitle,
      channelLink: createMarkdownLink(
        'Database/Meta/YouTubeChannel',
        channelTitle
      ),
      chapters,
      description,
      id,
      thumbnail: highThumbnail ?? defaultThumbnail,
      title,
      url
    };
  }
}
