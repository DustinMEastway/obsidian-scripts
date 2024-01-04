import { EntryApis } from './types';

/** Gets the value out of the clipboard if there is anything in it. */
export async function getClipboard(
  quickAddApi: EntryApis['quickAddApi']
): Promise<string> {
  try {
    return await quickAddApi.utility.getClipboard();
  } catch {
    return '';
  }
}