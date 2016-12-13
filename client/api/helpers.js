import URI from 'urijs';
import urljoin from 'url-join';

import settings from './settings';

export function urlBuilder(basePath = []) {
  return (endpointPath = [], query = {}) => {
    const path = urljoin(
      settings.API_PATH
        .concat(basePath)
        .concat(endpointPath)
      );

    const baseData = process.env.NODE_ENV !== 'production'
      ? settings.env.DEV
      : settings.env.PROD;

    return URI.build({
      ...baseData,
      query,
      path
    });
  };
}

// TODO(marko): good enough for now, add params when necessary
export function headerBuilder(headers = {}) {
  return {
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
};
