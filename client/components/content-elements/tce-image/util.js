const crypto = require('crypto');
const info = require('./info');
const isString = require('lodash/isString');
const isUrl = require('is-url');
const mime = require('mime-types');

const DEFAULT_IMAGE_EXTENSION = 'png';

function processImage(asset, { config, storage, storageProxy }) {
  const image = asset.data.url;
  const base64Pattern = /^data:image\/(\w+);base64,/;

  if (!isString(image) || (!isUrl(image) && !image.match(base64Pattern))) {
    return Promise.resolve(asset);
  }

  if (isUrl(image)) {
    const url = new URL(image);
    asset.data.url = url.pathname.substr(1, image.length);
    return Promise.resolve(asset);
  }

  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;
  const hashString = `${asset.id}${file}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');
  const key = `${config.storage.path}/${asset.id}/${hash}.${extension}`;
  asset.data.url = key;
  return saveFile(key, file, storage).then(() => asset);
}

function resolveImage(asset, { storage, storageProxy }) {
  if (!asset.data || !asset.data.url) return Promise.resolve(asset);

  function getUrl(key) {
    asset.data.url = storageProxy.getFileUrl(key);
    return asset;
  }

  return storage.fileExists(asset.data.url)
    .then(exists => exists ? getUrl(asset.data.url) : asset);
}

function saveFile(key, file, storage) {
  // TODO: Investigate and properly set 'ACL' grant in options
  const options = { ContentType: mime.lookup(key) };
  return storage.saveFile(key, file, options);
}

module.exports = {
  ...info,
  beforeSave: processImage,
  afterSave: resolveImage,
  afterRetrieve: resolveImage
};
