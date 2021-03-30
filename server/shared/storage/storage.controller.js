'use strict';

const { getFileUrl, getPath, saveFile } = require('../../repository/storage');
const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const { createError } = require('../error/helpers');
const fecha = require('fecha');
const fromPairs = require('lodash/fromPairs');
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');
const { UNAUTHORIZED } = require('http-status-codes');

const getStorageUrl = key => `${config.protocol}${key}`;

function getUrl(req, res) {
  const { repository, query: { key } } = req;
  const storageAssetsPath = getPath(repository.id);
  if (!key.startsWith(storageAssetsPath)) {
    return createError(UNAUTHORIZED, 'Access restricted');
  }
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file, body, user, repository }, res) {
  const { name } = path.parse(file.originalname);
  const { id: repositoryId } = repository;
  if (body.unpack) {
    const timestamp = fecha.format(new Date(), 'YYYY-MM-DDTHH:mm:ss');
    const root = `${timestamp}__${user.id}__${name}`;
    const assets = await uploadArchiveContent(repositoryId, file, root);
    return res.json({ root, assets });
  }
  const asset = await uploadFile(repositoryId, file, name);
  return res.json(asset);
}

module.exports = { getUrl, upload };

async function uploadFile(repositoryId, file, name) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const fileName = `${hash}___${name}${extension}`;
  const key = path.join(getPath(repositoryId), fileName);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return { key, publicUrl, url: getStorageUrl(key) };
}

async function uploadArchiveContent(repositoryId, archive, name) {
  const buffer = await readFile(archive);
  const content = await JSZip.loadAsync(buffer);
  const files = pickBy(content.files, it => !it.dir);
  const keys = await Promise.all(Object.keys(files).map(async src => {
    const key = path.join(getPath(repositoryId), name, src);
    const file = await content.file(src).async('uint8array');
    const mimeType = mime.lookup(src);
    await saveFile(key, Buffer.from(file), { ContentType: mimeType });
    return [key, getStorageUrl(key)];
  }));
  return fromPairs(keys);
}
