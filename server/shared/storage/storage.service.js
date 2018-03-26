const crypto = require('crypto');
const fileType = require('file-type');
const logger = require('../logger');
const mime = require('mime-types');
const storage = require('./index');

class StorageService {
  createHash(id, buffer) {
    const content = `${id}${buffer}`;
    return hash(content);
  }

  async saveItem(id, buffer, { mimetype } = {}) {
    const hash = this.createHash(id, buffer);
    if (!mimetype) mimetype = fileType(buffer).mime;
    const extension = mime.extension(mimetype);
    const key = `repository/assets/${id}/${hash}.${extension}`;
    const options = { ACL: 'public-read', ContentType: mimetype };
    logger.info(`Storing item: ${key}\nusing provider:`, storage.provider);
    await storage.saveFile(key, buffer, options);
    return key;
  }

  async getItemUrl(key, { expires = 3600 } = {}) {
    logger.info(`Requesting public url for item: ${key}\nusing provider:`, storage.provider);
    const exists = await storage.fileExists(key);
    return exists && storage.getFileUrl(key, { expires });
  }
}

module.exports = new StorageService();

function hash(str, { algorithm = 'md5' } = {}) {
  return crypto.createHash(algorithm).update(str).digest('hex');
}
