// const libs = {
//   error: {
//     create: (message) => {
//       new Notice(message, 5000);
//       return new Error(message);
//     }
//   },
//   markdown: {
//     convertFileName(fileName) {
//       return fileName.replace(
//         libs.markdown._search.invalidFileName,
//         ''
//       );
//     },
//     createLink(directory, item) {
//       directory = (directory && !directory.endsWith('/')) ? (
//         `${directory}/`
//       ) : directory;

//       return `"[[${directory}${item}|${item}]]"`;
//     },
//     _search: {
//       invalidFileName: /[\\,#%&\{\}\/*<>$\'\":@]*/g
//     }
//   },
//   settings: {
//     createOptions: (settings) => {
//       return Object.fromEntries(Object.entries(settings).map(([
//         _,
//         {
//           label,
//           value,
//           ...args
//         }
//       ]) => {
//         return [
//           label,
//           {
//             defaultValue: value,
//             ...args
//           }
//         ];
//       }));
//     },
//     setSettings(options) {
//       Object.entries(settings).forEach(([key, { label }]) => {
//         settings[key].value = options[label];
//       });
//     }
//   },
//   youtube: {
//     async getChannel(id) {
//       const channels = (await libs.youtube._fetchJson('channels', {
//         id,
//         part: 'brandingSettings,id,snippet'
//       })).items ?? [];

//       return (channels.length) ? (
//         libs.youtube._convertChannel(channels[0])
//       ) : null;
//     },
//     async getVideo(id) {
//       const videos = (
//         await libs.youtube._fetchJson('videos', {
//           id,
//           part: 'id,snippet'
//         })
//       ).items ?? [];

//       return (videos.length) ? (
//         libs.youtube._convertVideo(videos[0])
//       ) : null;
//     },
//     async search(query) {
//       return ((await libs.youtube._fetchJson('search', {
//         maxResults: 10,
//         part: 'snippet',
//         q: query,
//         type: libs.youtube._convertMediaTypeBack(settings.mediaType.value)
//       })).items ?? []).map(libs.youtube._convertSearch);
//     },
//     _convertChannel(channel) {
//       const {
//         id,
//         snippet: {
//           customUrl,
//           localized: {
//             description,
//             title
//           },
//           thumbnails: {
//             default: {
//               url: defaultThumbnail
//             },
//             high: {
//               url: highThumbnail
//             }
//           }
//         },
//         brandingSettings: {
//           image: {
//             bannerExternalUrl
//           }
//         }
//       } = channel;

//       return {
//         banner: bannerExternalUrl,
//         description,
//         id,
//         url: `${youtubeUrl}/${customUrl}`,
//         thumbnail: highThumbnail ?? defaultThumbnail,
//         title
//       };
//     },
//     _convertSearch(search) {
//       const id = Object.entries(search.id).find(([key]) => {
//         return key === 'id' || key.endsWith('Id');
//       })[1];
//       const {
//         snippet: {
//           description,
//           title
//         }
//       } = search;

//       return {
//         description,
//         id,
//         title
//       };
//     },
//     _convertVideo(video) {
//       const {
//         id,
//         snippet: {
//           channelTitle,
//           localized: {
//             title
//           },
//           thumbnails: {
//             default: {
//               url: defaultThumbnail
//             },
//             high: {
//               url: highThumbnail
//             }
//           }
//         }
//       } = video;
//       const url = `${youtubeUrl}/watch?v=${id}`;
//       let { description } = video.snippet.localized;
//       let chapters = '';
//       const chaptersMatch = chaptersSearch.exec(description);
//       if (chaptersMatch) {
//         description = (
//           description.slice(0, chaptersMatch.index).trim()
//           + description.slice(chaptersMatch.index + chaptersMatch[0].length).trim()
//         );
//         chapters = chaptersMatch[1].split('\n').map((chapter) => {
//           // There are multiple times and titles because they can be a the beginning or end.
//           const [_, time1, title1, title2, time2] = chapterTimeSearch.exec(chapter);
//           const time = time1 ?? time2;
//           const title = title1 ?? title2;
//           const splitTime = time.split(':').reverse().map((t) => {
//             return parseInt(t, 10);
//           });

//           if (
//             splitTime.length < 1
//             || splitTime.length > 3
//             || splitTime.some((t) => isNaN(t) || t < 0)
//           ) {
//             throw libs.error.create('Chapter timestamps not formatted properly.');
//           }

//           const timeInSeconds = (
//             // Seconds.
//             splitTime[0]
//             // Minutes.
//             + (splitTime[1] ?? 0) * 60
//             // Hours.
//             + (splitTime[2] ?? 0) * 60 * 60
//           );
//           return `## ${title} ([${time}](${url}&t=${timeInSeconds}))`;
//         }).join('\n\n');
//       }

//       return {
//         channel: channelTitle,
//         channelLink: libs.markdown.createLink(
//           'Database/Meta/YouTubeChannel',
//           channelTitle
//         ),
//         chapters,
//         description,
//         id,
//         url,
//         thumbnail: highThumbnail ?? defaultThumbnail,
//         title
//       };
//     },
//     _convertMediaTypeBack(mediaType) {
//       switch (mediaType) {
//         case MediaType.channel:
//           return 'channel';
//         case MediaType.video:
//           return 'video';
//         default: {
//           throw libs.error.create(
//             `Unable to convert media type '${mediaType}'.`
//           );
//         }
//       }
//     },
//     _fetchJson: async (path, query) => {
//       let url = new URL(`${settings.apiUrl.value}/${path}`);
//       if (query) {
//         Object.entries(query).forEach(([key, value]) => {
//           url.searchParams.append(key, value);
//         });
//       }

//       url.searchParams.append('key', settings.apiKey.value);
//       return JSON.parse(await request({
//         url: url.href,
//         method: 'GET',
//         cache: 'no-cache',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }));
//     }
//   }
// };

// const ApiUrl = {
//   youtubeV3: 'https://www.googleapis.com/youtube/v3'
// };

// const MediaType = {
//   channel: 'Channel',
//   video: 'Video'
// };

// const chapterTimeSearch = /^(\d+(?::\d+)*) *[\-:]? +(.*) *|(.*?) *[\-:]? +(\d+(?::\d+)*) *$/;
// const chaptersSearch = /^.*Timestamps:?\s*\n((?: *\n?.* \d+(:\d+)*| *\n?\d+(:\d+)* .*)+)/mi;
// const youtubeUrl = 'https://www.youtube.com';

// const settings = {
//   apiKey: {
//     label: 'API Key',
//     type: 'text',
//     value: ''
//   },
//   apiUrl: {
//     label: 'API URL',
//     options: Object.values(ApiUrl),
//     type: "dropdown",
//     value: ApiUrl.youtubeV3
//   },
//   mediaType: {
//     label: 'Media Type',
//     options: Object.values(MediaType),
//     type: 'dropdown',
//     value: MediaType.video
//   }
// };

// module.exports = {
//   entry: main,
//   settings: {
//     name: 'Search YouTube',
//     author: 'Dustin M. Eastway',
//     options: libs.settings.createOptions(settings)
//   }
// };

// async function main(QuickAdd, configSettings) {
//   libs.settings.setSettings(configSettings);
//   const mediaType = settings.mediaType.value;
//   let query = await QuickAdd.quickAddApi.inputPrompt(
//     `Enter a search for ${mediaType}: `
//   );
//   if (!query) {
//       throw libs.error.create('No query entered.');
//   }

//   const videoId = new RegExp(`${youtubeUrl}/watch\\?.*\\bv=([^&]+)`).exec(query)?.[1];
//   if (videoId) {
//     query = videoId;
//   } else if (query.startsWith(`${youtubeUrl}/`)) {
//     query = query.slice(youtubeUrl.length + 1);
//   }

//   const search = async () => {
//     const options = await libs.youtube.search(query);
//     const choice = (options.length === 1) ? options[0] : (
//       await QuickAdd.quickAddApi.suggester(
//         options.map(({ description, title }) => {
//           return `${title} - ${description}`;
//         }),
//         options
//       )
//     );
//     if (!choice) {
//       throw libs.error.create('No choice selected.');
//     }

//     return choice;
//   };

//   switch (mediaType) {
//     case MediaType.channel: {
//       const { id } = await search();
//       QuickAdd.variables = await libs.youtube.getChannel(id);
//       break;
//     }
//     case MediaType.video: {
//       let item = await libs.youtube.getVideo(query);
//       if (!item) {
//         const { id } = await search();
//         item = await libs.youtube.getVideo(id);
//       }
//       QuickAdd.variables = item;
//       break;
//     }
//     default:
//       throw libs.error.create(`Unknown mediaType '${mediaType}' provided.`);
//   }

//   if (QuickAdd.variables == null) {
//     throw libs.error.create(`Unable to find selected YouTube ${mediaType}.`);
//   }

//   QuickAdd.variables.title = libs.markdown.convertFileName(
//     QuickAdd.variables.title
//   );
// }
