import { getAllMatches } from "@/string";
import { HtmlHeader } from "./types";
import { removeHtmlTags } from "./remove-html-tags";

const headersSearch = /<span [^>]*class="mainlink"[^>]*>[\s\S]*?<a [^>]*href="([^"]+)"[^>]*>([\s\S]+?)<\/a>/g;

export function getJsWeeklyHeaders(html: string): HtmlHeader[] {
  const matches = getAllMatches(headersSearch, html);

  return matches.map(([_fullMatch, url, title]) => {
    return {
      content: removeHtmlTags(title),
      level: 1,
      url
    };
  });
}
