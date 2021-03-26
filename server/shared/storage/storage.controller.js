'use strict';

const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const fecha = require('fecha');
const fromPairs = require('lodash/fromPairs');
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');
const Storage = require('./');

const getStorageUrl = key => `${config.protocol}${key}`;
const storage = new Storage(config);

function getUrl(req, res) {
  const { query: { key } } = req;
  return storage.getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file, body, user }, res) {
  const { folder, unpack } = body;
  const { name } = path.parse(file.originalname);
  if (unpack) {
    const timestamp = fecha.format(new Date(), 'YYYY-MM-DDTHH:mm:ss');
    const root = `${timestamp}__${user.id}__${name}`;
    const assets = await uploadArchiveContent(folder, file, root);
    return res.json({ root, assets });
  }
  const asset = await uploadFile(folder, file, name);
  return res.json(asset);
}

module.exports = { getUrl, upload };

async function uploadFile(folder, file, name) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const fileName = `${hash}___${name}${extension}`;
  const keyComponents = [folder, fileName].filter(Boolean);
  const key = path.join(...keyComponents);
  await storage.saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await storage.getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}

async function uploadArchiveContent(folder, archive, name) {
  const buffer = await readFile(archive);
  const content = await JSZip.loadAsync(buffer);
  const files = pickBy(content.files, it => !it.dir);
  const keys = await Promise.all(Object.keys(files).map(async src => {
    const keyComponents = [folder, name, src].filter(Boolean);
    const key = path.join(...keyComponents);
    const file = await content.file(src).async('uint8array');
    const mimeType = mime.lookup(src);
    await storage.saveFile(key, Buffer.from(file), {
      ContentType: mimeType
    });
    return [key, getStorageUrl(key)];
  }));
  return fromPairs(keys);
}
