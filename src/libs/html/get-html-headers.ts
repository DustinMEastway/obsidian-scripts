import { getAllMatches } from "@/string";
import { removeHtmlTags } from "./remove-html-tags";
import { HtmlHeader } from "./types";

const headersSearch = /<(h(\d)\b)[\s\S]*?>([\s\S]+?)<\/\1>/g;

export function getHtmlHeaders(html: string): HtmlHeader[] {
  const matches = getAllMatches(headersSearch, html);

  return matches.map(([_fullMatch, _tag, depth, content]) => {
    return {
      content: removeHtmlTags(content),
      level: parseInt(depth, 10)
    }
  });
}