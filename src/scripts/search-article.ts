// const libs = {
//   error: {
//     create: (message) => {
//       new Notice(message, 5000);
//       return new Error(message);
//     }
//   },
//   markdown: {
//     getTitle(html) {
//       const title = libs.markdown._search.title.exec(html)?.[1];
//       return (!title) ? null : libs.markdown.convertFileName(title);
//     },
//     convertFileName(fileName) {
//       return fileName.replace(
//         libs.markdown._search.invalidFileName,
//         ''
//       );
//     },
//     convertHeaders(html) {
//       const matches = libs.regex.execAll(
//         libs.markdown._search.headers,
//         html
//       );

//       return matches.map(([_fullMatch, _tag, depth, content]) => {
//         const headerPrefix = '#' + '#'.repeat(parseInt(depth, 10));
//         content = libs.markdown._removeTags(content);
//         return `${headerPrefix} ${content}`;
//       }).join('\n');
//     },
//     _removeTags(html) {
//       const search = libs.markdown._search.tags;
//       while (search.test(html)) {
//         html = html.replace(search, '$2')
//       }
//       return html;
//     },
//     _search: {
//       headers: /<(h(\d)\b)[\s\S]*?>([\s\S]+?)<\/\1>/g,
//       invalidFileName: /[\\,#%&\{\}\/*<>$\'\":@]*/g,
//       title: /<head\b[\s\S]*<title\b[^>]*>(.*?)</,
//       tags: /<([0-9a-zA-Z]+\b)[\s\S]*?>([\s\S]+?)<\/\1>/g
//     }
//   },
//   regex: {
//     execAll(regex, text) {
//       const matches = [];
//       if (!regex.global) {
//         throw libs.error.create('Provided regex must have the "global" flag enabled.');
//       }

//       let match;
//       do {
//         match = regex.exec(text);
//         if (match) {
//           matches.push(match);
//         }
//       } while(match);

//       return matches;
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
//   }
// };

// const settings = {
// };

// module.exports = {
//   entry: main,
//   settings: {
//     name: 'Search article',
//     author: 'Dustin M. Eastway',
//     options: libs.settings.createOptions(settings)
//   }
// };

// async function main(QuickAdd, configSettings) {
//   libs.settings.setSettings(configSettings);

//   const query = await QuickAdd.quickAddApi.inputPrompt(
//     'Enter article URL: '
//   );
//   if (!query) {
//     throw libs.error.create('No query entered.');
//   }

//   const response = await request({
//     url: query,
//     method: 'GET',
//     cache: 'no-cache'
//   });

//   QuickAdd.variables = {
//     headers: libs.markdown.convertHeaders(response),
//     fileName: libs.markdown.getTitle(response),
//     url: query
//   };
// }
