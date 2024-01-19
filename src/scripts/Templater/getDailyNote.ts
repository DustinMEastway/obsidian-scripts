import { TimeInMs, createDateLink } from '@';

export = function (
  oldDateString: string,
  shift = 0
) {
  const oldDate = new Date(`${oldDateString}T00:00:00`);
  const newDate = new Date(oldDate.getTime() + (shift * TimeInMs.days));

  return createDateLink(newDate);
}
