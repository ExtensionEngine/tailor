import mapValues from 'lodash/mapValues';

export const numeric = route => mapValues(route.params, Number);
