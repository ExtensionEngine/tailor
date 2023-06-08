import BaseProxy from '../shared/storage/proxy/index.js';
import { storage as config } from '../../config/server/index.js';
import path from 'node:path';

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

export default await Proxy.create(config.proxy);
