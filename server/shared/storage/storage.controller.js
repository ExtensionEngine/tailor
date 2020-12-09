'use strict';

const { getFileUrl, saveFile } = require('./');
const { readFile, sha256 } = require('./util');
const config = require('../../../config/server').storage;
const JSZip = require('jszip');
const mime = require('mime-types');
const path = require('path');
const pickBy = require('lodash/pickBy');

function getUrl(req, res) {
  const { query: { key } } = req;
  return getFileUrl(key).then(url => res.json({ url }));
}

async function upload({ file, body }, res) {
  const uploader = body.archive ? uploadArchive : uploadFile;
  const { name } = path.parse(file.originalname);
  const data = await uploader(file, name);
  if (!Array.isArray(data)) return res.json({ ...data, url: `storage://${data.key}` });
  const assets = data.reduce((all, { key }) => ({ ...all, [key]: `storage://${key}` }), {});
  return res.json({ root: name, assets });
}

module.exports = { getUrl, upload };

async function uploadFile(file, name) {
  const buffer = await readFile(file);
  const hash = sha256(file.originalname, buffer);
  const extension = path.extname(file.originalname);
  const key = path.join(config.path, `${hash}___${name}${extension}`);
  await saveFile(key, buffer, { ContentType: file.mimetype });
  const publicUrl = await getFileUrl(key);
  return { key, publicUrl };
}

async function uploadArchive(archive, name) {
  const buffer = await readFile(archive);
  const content = await JSZip.loadAsync(buffer);
  const assets = pickBy(content.files, it => !it.dir);
  return Promise.all(Object.keys(assets).map(async src => {
    const key = path.join(config.path, `${name}/${src}`);
    const file = await content.file(src).async('uint8array');
    const mimeType = mime.lookup(src);
    await saveFile(key, Buffer.from(file), { ContentType: mimeType });
    return { key };
  }));
}
