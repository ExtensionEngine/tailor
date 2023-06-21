import { readFile, sha256 } from './util.js';
import { storage as config } from '../../../config/server/index.js';
import fecha from 'fecha';
import fromPairs from 'lodash/fromPairs.js';
import JSZip from 'jszip';
import mime from 'mime-types';
import path from 'node:path';
import pickBy from 'lodash/pickBy.js';
import Storage from '../../repository/storage.js';

const { getFileUrl, getPath, saveFile } = Storage;
const getStorageUrl = key => `${config.protocol}${key}`;

function getUrl(req, res) {
  const { query: { key } } = req;
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

export default {
  getUrl,
  upload
};

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
