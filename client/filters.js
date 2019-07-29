import _truncate from 'lodash/truncate';
import fecha from 'fecha';

const DEFAULT_DATE_FORMAT = 'MM/DD/YY HH:mm';

const isObject = arg => arg !== null && typeof arg === 'object';

export function formatDate(value, dateFormat = DEFAULT_DATE_FORMAT) {
  return value && fecha.format(new Date(value), dateFormat);
}

export function truncate(value, config) {
  config = isObject(config) ? config : { length: config };
  return value && _truncate(value, config);
}
