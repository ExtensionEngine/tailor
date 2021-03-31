'use strict';

const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const fecha = require('fecha');
const fromPairs = require('lodash/fromPairs');
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');

const getStorageUrl = key => `${config.protocol}${key}`;

function getUrl(storage) {
  return (req, res) => {
    const { query: { key } } = req;
    return storage.getFileUrl(key).then(url => res.json({ url }));
  };
}

function upload(storage) {
  return async (req, res) => {
    const { file, body, user } = req;
    const { name } = path.parse(file.originalname);
    if (body.unpack) {
      const timestamp = fecha.format(new Date(), 'YYYY-MM-DDTHH:mm:ss');
      const root = `${timestamp}__${user.id}__${name}`;
      const assets = await uploadArchiveContent(storage, file, root);
      return res.json({ root, assets });
    }
    const asset = await uploadFile(storage, file, name);
    return res.json(asset);
  };
}

module.exports = { getUrl, upload };

async function uploadFile(storage, file, name) {
  const { originalname, mimetype } = file;
  const buffer = await readFile(file);
  const hash = sha256(originalname, buffer);
  const extension = path.extname(originalname) || `.${mime.extension(mimetype)}`;
  const key = `${hash}___${name}${extension}`;
  await storage.saveFile(key, buffer, { ContentType: mimetype });
  const publicUrl = await storage.getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}

async function uploadArchiveContent(storage, archive, name) {
  const buffer = await readFile(archive);
  const content = await JSZip.loadAsync(buffer);
  const files = pickBy(content.files, it => !it.dir);
  const keys = await Promise.all(Object.keys(files).map(async src => {
    const keyComponents = [name, src].filter(Boolean);
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
