const libs = {
  // date: {
  //   formatDate(date) {
  //     date = new Date(date);
  //     return [
  //       libs.string.pad(date.getUTCFullYear(), 4, { char: '0' }),
  //       libs.string.pad(date.getUTCMonth() + 1, 2, { char: '0' }),
  //       libs.string.pad(date.getUTCDate(), 2, { char: '0' })
  //     ].join('-');
  //   }
  // },
  error: {
    create: (message) => {
      new Notice(message, 5000);
      return new Error(message);
    }
  },
  markdown: {
    convertArray: (
      items,
      {
        linkDirectory = null,
        indentation = 1,
        prefix = '',
        suffix = ''
      } = {}
    ) => {
      if (!(items instanceof Array)) {
        return null;
      }

      const spaces = '    '.repeat(indentation);
      return items.map((item) => {
        item = item.trim();
        if (linkDirectory != null) {
          item = libs.markdown.createLink(linkDirectory, item);
        }

        return `\n${spaces}- ${prefix}${item}${suffix}`;
      }).join('');
    },
    convertFileName(fileName) {
      return fileName.replace(
        libs.markdown._search.invalidFileName,
        ''
      );
    },
    convertHeaders(html) {
      const matches = libs.regex.execAll(
        libs.markdown._search.headers,
        html
      );

      return matches.map(([_fullMatch, _tag, depth, content]) => {
        const headerPrefix = '#' + '#'.repeat(parseInt(depth, 10));
        content = libs.markdown._removeTags(content);
        return `${headerPrefix} ${content}`;
      }).join('\n');
    },
    createLink(directory, item) {
      directory = (directory && !directory.endsWith('/')) ? (
        `${directory}/`
      ) : directory;

      return `"[[${directory}${item}|${item}]]"`;
    },
    getTitle(html) {
      return libs.markdown._search.title.exec(html)?.[1] ?? null;
    },
    _removeTags(html) {
      const search = libs.markdown._search.tags;
      while (search.test(html)) {
        html = html.replace(search, '$2')
      }
      return html;
    },
    _search: {
      headers: /<(h(\d)\b)[\s\S]*?>([\s\S]+?)<\/\1>/g,
      invalidFileName: /[\\,#%&\{\}\/*<>$\'\":@]*/g,
      title: /<head\b[\s\S]*<title\b[^>]*>(.*?)</,
      tags: /<([0-9a-zA-Z]+\b)[\s\S]*?>([\s\S]+?)<\/\1>/g
    }
  },
  object: {
    camelCase: (item) => {
      if (item == null || typeof item !== 'object') {
        return item;
      } else if (item instanceof Array) {
        return item.map(libs.object.camelCase);
      }

      return Object.fromEntries(
          Object.entries(item).map(([key, value]) => {
          return [
            libs.string.convertCase(key, libs.string.Case.camel),
            libs.object.camelCase(value)
          ];
        }).sort(([a], [b]) => {
          return a.localeCompare(b);
        })
      );
    }
  },
  omdb: {
    formatTitle: ({ title, year }) => {
      return `${title} (${year})`;
    },
    getById: async (id) => {
      const response = await libs.omdb._fetchJson('', { i: id });
      if (!response) {
        throw libs.error.create('No results found.');
      }

      return libs.omdb._convert(response);
    },
    getByQuery: async (query) => {
      let response = ((
        await libs.omdb._fetchJson('', { s: query })
      )?.Search ?? []).map(
        libs.omdb._convert
      );

      response = response.filter((item) => {
        return item.type === settings.mediaType.value;
      });

      if (!response.length) {
        throw libs.error.create('No results found.');
      }

      return response;
    },
    _convert: (item) => {
      item = libs.object.camelCase(item);
      const convertType = (type) => {
        switch (type) {
          case 'game':
            return MediaType.game;
          case 'movie':
            return MediaType.movie;
          case 'series':
            return MediaType.show;
        }

        throw libs.error.create(`Unknown media type '${type}'.`);
      };

      const {
        actors,
        director,
        genre,
        imdbRating
      } = item;
      const type = convertType(item.type);

      return {
        ...item,
        actorLinks: (actors === 'N/A') ? [] : libs.markdown.convertArray(
          actors?.split(','),
          { linkDirectory: "Database/Characters/Nonfiction" }
        ) ?? [],
        directorLinks: (director === 'N/A') ? [] : libs.markdown.convertArray(
          director?.split(','),
          { linkDirectory: "Database/Characters/Nonfiction" }
        ) ?? [],
        fileName: libs.markdown.convertFileName(
          libs.omdb.formatTitle(item)
        ),
        genreLinks: (genre === 'N/A') ? [] : libs.markdown.convertArray(
          genre?.split(','),
          { linkDirectory: "Database/Meta/Genre" }
        ) ?? [],
        imdbRating: imdbRating * 10,
        type,
        typeLink: `"[[${type}]]"`
      };
    },
    _fetchJson: async (path, query) => {
      let url = new URL(`${settings.apiUrl.value}/${path}`);
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      url.searchParams.append('apikey', settings.apiKey.value);
      return JSON.parse(await request({
        url: url.href,
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    }
  },
  settings: {
    createOptions: (settings) => {
      return Object.fromEntries(Object.entries(settings).map(([
        _,
        {
          label,
          value,
          ...args
        }
      ]) => {
        return [
          label,
          {
            defaultValue: value,
            ...args
          }
        ];
      }));
    },
    setSettings(options) {
      Object.entries(settings).forEach(([key, { label }]) => {
        settings[key].value = options[label];
      });
    }
  },
  // string: {
  //   Case: {
  //     /** @example 'fooBar'. */
  //     camel: 'camel',
  //     /** @example 'foo-bar'. */
  //     kebab: 'kebab',
  //     /** @example 'FooBar'. */
  //     pascal: 'pascal',
  //     /** @example 'foo_bar'. */
  //     snake: 'snake',
  //     /** @example 'Foo Bar'. */
  //     title: 'title'
  //   },
  //   convertCase(value, convertType) {
  //     const valueArray = (
  //       value
  //         // Seperates words based placing of capitals, spaces, and numbers.
  //         .replace(/[^a-zA-Z0-9\n]|([a-z])(?=[A-Z])|(\D)(?=\d)|(\d)(?=\D)/g, '$1$2$3 ')
  //         .trim()
  //         .toLowerCase()
  //         .split(/\s+/)
  //     );
  //     switch (convertType) {
  //       case libs.string.Case.camel: {
  //         const words = libs.string._titleCaseWords(valueArray);
  //         return [words[0]?.toLowerCase(), ...words.slice(1)].join('');
  //       }
  //       case libs.string.Case.kebab:
  //         return valueArray.join('-');
  //       case libs.string.Case.pascal:
  //         return libs.string._titleCaseWords(valueArray).join('');
  //       case libs.string.Case.snake:
  //         return valueArray.join('_');
  //       case libs.string.Case.title:
  //         return libs.string._titleCaseWords(valueArray).join(' ');
  //       default: {
  //         throw new Error(`incorrect case type '${invalidType}'`);
  //       }
  //     }
  //   },
  //   pad(
  //     value,
  //     minLength,
  //     {
  //       char = ' ',
  //       end = false
  //     }
  //   ) {
  //     value = `${value}`;
  //     while (value.length < minLength) {
  //       value = ((end) ? '' : char) + value + ((end) ? char : '');
  //     }
  //     return value;
  //   },
  //   /**
  //    * Capitalize the first letter of each word.
  //    *
  //    * @warning It is assumed that words are all lower cased.
  //    */
  //   _titleCaseWords(words) {
  //     return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  //   }
  // },
  youtube: {
    async getChannel(id) {
      const channels = (await libs.youtube._fetchJson('channels', {
        id,
        part: 'brandingSettings,id,snippet'
      })).items ?? [];

      return (channels.length) ? (
        libs.youtube._convertChannel(channels[0])
      ) : null;
    },
    async getVideo(id) {
      const videos = (
        await libs.youtube._fetchJson('videos', {
          id,
          part: 'id,snippet'
        })
      ).items ?? [];

      return (videos.length) ? (
        libs.youtube._convertVideo(videos[0])
      ) : null;
    },
    async search(query) {
      return ((await libs.youtube._fetchJson('search', {
        maxResults: 10,
        part: 'snippet',
        q: query,
        type: libs.youtube._convertMediaTypeBack(settings.mediaType.value)
      })).items ?? []).map(libs.youtube._convertSearch);
    },
    _convertChannel(channel) {
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
    },
    _convertSearch(search) {
      const id = Object.entries(search.id).find(([key]) => {
        return key === 'id' || key.endsWith('Id');
      })[1];
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
    },
    _convertVideo(video) {
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
          + description.slice(chaptersMatch.index + chaptersMatch[0].length).trim()
        );
        chapters = '\n# Chapters\n\n' + chaptersMatch[1].split('\n').map((chapter) => {
          const [time, chapterTitle] = chapter.split(chapterTimeSearch);
          const splitTime = time.split(':').reverse().map((t) => {
            return parseInt(t, 10);
          });

          if (
            splitTime.length < 1
            || splitTime.length > 3
            || splitTime.some((t) => isNaN(t) || t < 0)
          ) {
            throw libs.error.create('Chapter timestamps not formatted properly.');
          }

          const timeInSeconds = (
            // Seconds.
            splitTime[0]
            // Minutes.
            + (splitTime[1] ?? 0) * 60
            // Hours.
            + (splitTime[2] ?? 0) * 60 * 60
          );
          return `## ${chapterTitle} ([${time}](${url}&t=${timeInSeconds}))`;
        }).join('\n\n');
      }

      return {
        channel: channelTitle,
        channelLink: libs.markdown.createLink(
          'Database/Meta/YouTubeChannel',
          channelTitle
        ),
        chapters,
        description,
        id,
        url,
        thumbnail: highThumbnail ?? defaultThumbnail,
        title
      };
    },
    _convertMediaTypeBack(mediaType) {
      switch (mediaType) {
        case MediaType.channel:
          return 'channel';
        case MediaType.video:
          return 'video';
        default: {
          throw libs.error.create(
            `Unable to convert media type '${mediaType}'.`
          );
        }
      }
    },
    _fetchJson: async (path, query) => {
      let url = new URL(`${settings.apiUrl.value}/${path}`);
      if (query) {
        Object.entries(query).forEach(([key, value]) => {
          url.searchParams.append(key, value);
        });
      }

      url.searchParams.append('key', settings.apiKey.value);
      return JSON.parse(await request({
        url: url.href,
        method: 'GET',
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        }
      }));
    }
  }
};
