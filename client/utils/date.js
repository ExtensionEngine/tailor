import compareAsc from 'date-fns/compareAsc';
import fecha from 'fecha';

export function isAfterOrEqual(firstDate, secondDate) {
  return compareAsc(firstDate, secondDate) !== -1;
}

export function truncateTime(dateTime) {
  const format = 'YYYY-MM-DD';
  const date = fecha.format(dateTime, format);
  return fecha.parse(date, format);
}
