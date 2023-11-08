import { createError } from "@/obsidian";

export function getAllMatches(
  regex: RegExp,
  text: string
): RegExpExecArray[] {
  const matches: RegExpExecArray[] = [];
  if (!regex.global) {
    throw createError('Provided regex must have the "global" flag enabled.');
  }

  let match: RegExpExecArray | null;
  do {
    match = regex.exec(text);
    if (match) {
      matches.push(match);
    }
  } while(match);

  return matches;
}
