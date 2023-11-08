import { formatDate } from "@";

const msInADay = 24 * 60 * 60 * 1000;

export = function (
  oldDateString: string,
  shift = 0
) {
  const oldDate = new Date(
    `${oldDateString}`
  );
  const newDateString = formatDate(
    oldDate.getTime() + (shift * msInADay)
  );

  return `[[Database/Note/DailyNote/${newDateString}|${newDateString}]]`;
}
