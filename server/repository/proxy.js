'use strict';

const path = require('path');
const proxy = require('../shared/storage/proxy');

const storageCookies = {
  REPOSITORY: 'Storage-Repository'
};

class RepositoryProxyAccessManager extends proxy.AccessManager {
  getSignedCookies(repositoryId, maxAge) {
    const resource = path.join('repository', `${repositoryId}`);
    return {
      ...super.getSignedCookies(resource, maxAge),
      [storageCookies.REPOSITORY]: repositoryId
    };
  }

  hasCookies(cookies, repositoryId) {
    const { REPOSITORY } = storageCookies;
    const isRepositoryId = cookies[REPOSITORY] === repositoryId.toString();
    return isRepositoryId && super.hasCookies(cookies);
  }

  getCookieNames() {
    return [
      ...super.getCookieNames(),
      ...Object.values(storageCookies)
    ];
  }
}

module.exports = new RepositoryProxyAccessManager(proxy.config);
