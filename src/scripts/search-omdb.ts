// const libs = {
//   error: {
//     create: (message) => {
//       new Notice(message, 5000);
//       return new Error(message);
//     }
//   },
//   markdown: {
//     convertArray: (
//       items,
//       {
//         linkDirectory = null,
//         indentation = 1,
//         prefix = '',
//         suffix = ''
//       } = {}
//     ) => {
//       if (!(items instanceof Array)) {
//         return null;
//       }

//       const spaces = '    '.repeat(indentation);
//       return items.map((item) => {
//         item = item.trim();
//         if (linkDirectory != null) {
//           item = libs.markdown.createLink(linkDirectory, item);
//         }

//         return `\n${spaces}- ${prefix}${item}${suffix}`;
//       }).join('');
//     },
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
//       invalidFileName: /[\\,#%&\{\}\/*<>$\'\":@]*/g,
//     }
//   },
//   object: {
//     camelCase: (item) => {
//       if (item == null || typeof item !== 'object') {
//         return item;
//       } else if (item instanceof Array) {
//         return item.map(libs.object.camelCase);
//       }

//       return Object.fromEntries(
//           Object.entries(item).map(([key, value]) => {
//           return [
//             libs.string.convertCase(key, libs.string.Case.camel),
//             libs.object.camelCase(value)
//           ];
//         }).sort(([a], [b]) => {
//           return a.localeCompare(b);
//         })
//       );
//     }
//   },
//   omdb: {
//     formatTitle: ({ title, year }) => {
//       return `${title} (${year})`;
//     },
//     getById: async (id) => {
//       const response = await libs.omdb._fetchJson('', { i: id });
//       if (!response) {
//         throw libs.error.create('No results found.');
//       }

//       return libs.omdb._convert(response);
//     },
//     getByQuery: async (query) => {
//       let response = ((
//         await libs.omdb._fetchJson('', { s: query })
//       )?.Search ?? []).map(
//         libs.omdb._convert
//       );

//       response = response.filter((item) => {
//         return item.type === settings.mediaType.value;
//       });

//       if (!response.length) {
//         throw libs.error.create('No results found.');
//       }

//       return response;
//     },
//     _convert: (item) => {
//       item = libs.object.camelCase(item);
//       const convertType = (type) => {
//         switch (type) {
//           case 'game':
//             return MediaType.game;
//           case 'movie':
//             return MediaType.movie;
//           case 'series':
//             return MediaType.show;
//         }

//         throw libs.error.create(`Unknown media type '${type}'.`);
//       };

//       const {
//         actors,
//         director,
//         genre,
//         imdbRating
//       } = item;
//       const type = convertType(item.type);

//       return {
//         ...item,
//         actorLinks: (actors === 'N/A') ? [] : libs.markdown.convertArray(
//           actors?.split(','),
//           { linkDirectory: "Database/Characters/Nonfiction" }
//         ) ?? [],
//         directorLinks: (director === 'N/A') ? [] : libs.markdown.convertArray(
//           director?.split(','),
//           { linkDirectory: "Database/Characters/Nonfiction" }
//         ) ?? [],
//         fileName: libs.markdown.convertFileName(
//           libs.omdb.formatTitle(item)
//         ),
//         genreLinks: (genre === 'N/A') ? [] : libs.markdown.convertArray(
//           genre?.split(','),
//           { linkDirectory: "Database/Meta/Genre" }
//         ) ?? [],
//         imdbRating: imdbRating * 10,
//         type,
//         typeLink: `"[[${type}]]"`
//       };
//     },
//     _fetchJson: async (path, query) => {
//       let url = new URL(`${settings.apiUrl.value}/${path}`);
//       if (query) {
//         Object.entries(query).forEach(([key, value]) => {
//           url.searchParams.append(key, value);
//         });
//       }

//       url.searchParams.append('apikey', settings.apiKey.value);
//       return JSON.parse(await request({
//         url: url.href,
//         method: 'GET',
//         cache: 'no-cache',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       }));
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
//   string: {
//     Case: {
//       /** @example 'fooBar'. */
//       camel: 'camel',
//       /** @example 'foo-bar'. */
//       kebab: 'kebab',
//       /** @example 'FooBar'. */
//       pascal: 'pascal',
//       /** @example 'foo_bar'. */
//       snake: 'snake',
//       /** @example 'Foo Bar'. */
//       title: 'title'
//     },
//     convertCase(value, convertType) {
//       const valueArray = (
//         value
//           // Seperates words based placing of capitals, spaces, and numbers.
//           .replace(/[^a-zA-Z0-9\n]|([a-z])(?=[A-Z])|(\D)(?=\d)|(\d)(?=\D)/g, '$1$2$3 ')
//           .trim()
//           .toLowerCase()
//           .split(/\s+/)
//       );
//       switch (convertType) {
//         case libs.string.Case.camel: {
//           const words = libs.string._titleCaseWords(valueArray);
//           return [words[0]?.toLowerCase(), ...words.slice(1)].join('');
//         }
//         case libs.string.Case.kebab:
//           return valueArray.join('-');
//         case libs.string.Case.pascal:
//           return libs.string._titleCaseWords(valueArray).join('');
//         case libs.string.Case.snake:
//           return valueArray.join('_');
//         case libs.string.Case.title:
//           return libs.string._titleCaseWords(valueArray).join(' ');
//         default: {
//           throw new Error(`incorrect case type '${invalidType}'`);
//         }
//       }
//     },
//     /**
//      * Capitalize the first letter of each word.
//      *
//      * @warning It is assumed that words are all lower cased.
//      */
//     _titleCaseWords(words) {
//       return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
//     }
//   }
// };

// const ApiUrl = {
//   omdb: 'https://www.omdbapi.com'
// };

// const MediaType = {
//   game: 'Game',
//   movie: 'Movie',
//   show: 'Show'
// };

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
//     value: ApiUrl.omdb
//   },
//   mediaType: {
//     label: 'Media Type',
//     options: Object.values(MediaType),
//     type: 'dropdown',
//     value: MediaType.movie
//   }
// };

// const imdbIdSearch = /^tt\d+$/;
async function entry(QuickAdd, configSettings) {
  try {
    console.log('Hello World!');
  } catch (error) {
    Notice(error, 5000);
    throw error;
  }
//   libs.settings.setSettings(configSettings);

//   let query = await QuickAdd.quickAddApi.inputPrompt(
//     'Enter movie title or IMDB ID: '
//   );
//   if (!query) {
//       throw libs.error.create('No query entered.');
//   }

//   if (!imdbIdSearch.test(query)) {
//     const options = await libs.omdb.getByQuery(query);
//     const choice = (options.length === 1) ? options[0] : (
//       await QuickAdd.quickAddApi.suggester(
//         options.map((item) => libs.omdb.formatTitle(item)),
//         options
//       )
//     )
//     if (!choice) {
//       throw libs.error.create('No choice selected.');
//     }

//     query = choice.imdbId;
//   }

//   QuickAdd.variables = await libs.omdb.getById(query);
}

export = {
  entry,
  settings: {
    name: 'Search OMDB',
    author: 'Dustin M. Eastway',
    // options: createOptions(settings)
  }
}
