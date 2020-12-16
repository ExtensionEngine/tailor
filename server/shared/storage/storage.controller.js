'use strict';

const { getFileUrl, saveFile } = require('./');
const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const fecha = require('fecha');
const fromPairs = require('lodash/fromPairs');
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file, body, user }, res) {
  const { name } = path.parse(file.originalname);
  if (body.unpack) {
    const timestamp = fecha.format(new Date(), 'YYYY-MM-DDTHH:mm:ss');
    const root = `${timestamp}__${user.id}__${name}`;
    const assets = await uploadArchiveContent(file, root);
    return res.json({ root, assets });
  }
  const asset = await uploadFile(file, name);
  return res.json(asset);
}

module.exports = { getUrl, upload };

async function uploadFile(file, name) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const key = path.join(config.path, `${hash}___${name}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}

async function uploadArchiveContent(archive, name) {
  const buffer = await readFile(archive);
  const content = await JSZip.loadAsync(buffer);
  const files = pickBy(content.files, it => !it.dir);
  const keys = await Promise.all(Object.keys(files).map(async src => {
    const key = path.join(config.path, `${name}/${src}`);
    const file = await content.file(src).async('uint8array');
    const mimeType = mime.lookup(src);
    await saveFile(key, Buffer.from(file), { ContentType: mimeType });
    return [key, getStorageUrl(key)];
  }));
  return fromPairs(keys);
}

function getStorageUrl(key) {
  return `${config.protocol}${key}`;
}
