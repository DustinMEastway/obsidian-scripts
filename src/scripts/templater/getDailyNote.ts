import {
  NoteFolder,
  TimeInMs,
  createMarkdownLink,
  formatDate
} from '@';

export = function (
  oldDateString: string,
  shift = 0
) {
  const oldDate = new Date(
    `${oldDateString}T00:00:00`
  );
  const newDate = new Date(oldDate.getTime() + (shift * TimeInMs.days));

  return createMarkdownLink(
    NoteFolder.dailyNote,
    formatDate(newDate)
  );
}
