import BaseProxy from '../shared/storage/proxy/index.js';
import path from 'node:path';
import { storage } from '../../config/server/index.js';

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

const proxy = new Proxy(storage.proxy);
export default proxy;
