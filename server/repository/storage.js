import BaseStorage from '../shared/storage/index.js';
import { storage as config } from '../../config/server/index.js';
import path from 'node:path';

class Storage extends BaseStorage {
  getPath(repositoryId) {
    return path.join('repository', `${repositoryId}`, config.path);
  }
}

export default await Storage.create(config);
