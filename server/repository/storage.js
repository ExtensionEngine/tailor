import BaseStorage from '../shared/storage/index.js';
import path from 'node:path';
import serverConfig from '../../config/server/index.js';

const { storage: config } = serverConfig;

class Storage extends BaseStorage {
  getPath(repositoryId) {
    return path.join('repository', `${repositoryId}`, config.path);
  }
}

export default new Storage(config);
