'use strict';

const BaseProxy = require('../shared/storage/proxy');
const { proxy: config } = require('../../config/server').storage;
const path = require('path');

const storageCookies = {
  REPOSITORY: 'Storage-Repository'
};

class Proxy extends BaseProxy {
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

module.exports = new Proxy(config);
