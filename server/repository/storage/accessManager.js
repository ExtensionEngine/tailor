'use strict';

const AccessManager = require('../../shared/storage/proxy/AccessManager');
const path = require('path');

const storageCookies = { REPOSITORY: 'Storage-Repository' };

class RepositoryStorageAccessManager extends AccessManager {
  get cookies() {
    return Object.values(storageCookies);
  }

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
}

module.exports = new RepositoryStorageAccessManager();
