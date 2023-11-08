import {
  EntryApis,
  HttpRequestMethod,
  createError,
  createMarkdownFileName,
  createMarkdownHeaders,
  getHtmlHeaders,
  getHtmlTitle
} from "@";

async function entry(
  entryApis: EntryApis
) {
  const { quickAddApi } = entryApis;
  const query = await quickAddApi.inputPrompt(
    'Enter article URL: ',
    null,
    await quickAddApi.utility.getClipboard()
  );
  if (!query) {
    throw createError('No query entered.');
  }

  const response = await request({
    url: query,
    method: HttpRequestMethod.get
  });

  entryApis.variables = {
    headers: createMarkdownHeaders(
      getHtmlHeaders(response).map((header) => {
        header.level += 1;
        return header;
      })
    ),
    fileName: createMarkdownFileName(getHtmlTitle(response) ?? ''),
    url: query
  };
}

export = {
  entry,
  settings: {
    name: 'Search article',
    author: 'Dustin M. Eastway'
  }
};
