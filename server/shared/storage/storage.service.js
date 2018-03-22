const fileType = require('file-type');
const hasha = require('hasha');
const mime = require('mime-types');
const storage = require('./index');

class StorageService {
  createHash(id, buffer) {
    const content = `${id}${buffer}`;
    return hasha(content, { algorithm: 'md5' });
  }

  async saveItem(id, buffer, { mimetype } = {}) {
    const hash = this.createHash(id, buffer);
    if (!mimetype) mimetype = fileType(buffer).mime;
    const extension = mime.extension(mimetype);
    const key = `repository/assets/${id}/${hash}.${extension}`;
    const options = { ACL: 'public-read', ContentType: mimetype };
    await storage.saveFile(key, buffer, options);
    return key;
  }

  async getItemUrl(key, { expires = 3600 } = {}) {
    const exists = await storage.fileExists(key);
    return exists && storage.getFileUrl(key, { expires });
  }
}

module.exports = new StorageService();
