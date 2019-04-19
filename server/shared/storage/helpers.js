'use strict';

const crypto = require('crypto');
const isString = require('lodash/isString');
const isUrl = require('is-url');
const mime = require('mime-types');
const nodeUrl = require('url');
const Promise = require('bluebird');
const storage = require('@fabric/storage')(require('../../../config/server').storage);
const toPairs = require('lodash/toPairs');
const values = require('lodash/values');

const STORAGE_PROTOCOL = 'storage://';
const PRIMITIVES = ['HTML', 'TABLE-CELL', 'IMAGE', 'BRIGHTCOVE_VIDEO', 'VIDEO', 'EMBED'];
const DEFAULT_IMAGE_EXTENSION = 'png';
const isPrimitive = asset => PRIMITIVES.indexOf(asset.type) > -1;
const isQuestion = type => ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);

const ASSET_ROOT = 'repository/assets';

function processStatics(item) {
  return isQuestion(item.type)
    ? processQuestion(item)
    : processAsset(item);
}

function processAsset(asset) {
  return isPrimitive(asset) ? processPrimitive(asset) : processComposite(asset);
}

function processQuestion(element) {
  let question = element.data.question;
  if (!question || question.length < 1) return Promise.resolve(element);
  return Promise.each(question, it => processAsset(it));
}

function processPrimitive(primitive) {
  if (!isPrimitive(primitive)) throw new Error('Invalid primitive');
  if (!processor[primitive.type]) return Promise.resolve(primitive);
  return processor[primitive.type](primitive);
}

function processComposite(composite) {
  if (!composite.data.embeds) Promise.resolve(composite);
  return Promise.each(values(composite.data.embeds), it => processPrimitive(it))
    .then(() => composite);
}

let processor = {};

processor.IMAGE = asset => {
  const image = asset.data.url;
  const base64Pattern = /^data:image\/(\w+);base64,/;

  if (!isString(image) || (!isUrl(image) && !image.match(base64Pattern))) {
    return Promise.resolve(asset);
  }

  if (isUrl(image)) {
    let url = nodeUrl.parse(image);
    asset.data.url = url.pathname.substr(1, image.length);
    return Promise.resolve(asset);
  }

  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;
  const hashString = `${asset.id}${file}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');
  const key = `${ASSET_ROOT}/${asset.id}/${hash}.${extension}`;
  asset.data.url = key;
  return saveFile(key, file).then(() => asset);
};

// TODO: Temp patch until asset embeding is unified
async function resolveStatics(item) {
  const element = await (isQuestion(item.type)
    ? resolveQuestion(item)
    : resolveAsset(item));
  if (!element.data.assets) return element;
  await Promise.map(toPairs(element.data.assets), async ([key, url]) => {
    const isStorageResource = url.startsWith(STORAGE_PROTOCOL);
    element.data[key] = isStorageResource
      ? (await storage.getFileUrl(url.substr(STORAGE_PROTOCOL.length, url.length)))
      : url;
  });
  return element;
}

function resolveQuestion(element) {
  let question = element.data.question;
  if (!question || question.length < 1) return Promise.resolve(element);
  return Promise.each(question, it => resolveAsset(it)).then(() => element);
}

function resolveAsset(element) {
  return isPrimitive(element)
    ? resolvePrimitive(element)
    : resolveComposite(element);
}

function resolvePrimitive(primitive) {
  if (!resolver[primitive.type]) return Promise.resolve(primitive);
  return resolver[primitive.type](primitive);
}

function resolveComposite(composite) {
  return Promise.each(values(composite.data.embeds), resolvePrimitive)
    .then(() => composite);
}

let resolver = {};

resolver.IMAGE = asset => {
  if (!asset.data || !asset.data.url) return Promise.resolve(asset);

  function getUrl(key) {
    return storage.getFileUrl(key, { Expires: 3600 })
      .then(url => (asset.data.url = url))
      .then(() => asset);
  }

  return storage.fileExists(asset.data.url)
    .then(exists => exists ? getUrl(asset.data.url) : asset);
};

function saveFile(key, file) {
  const options = { ACL: 'public-read', ContentType: mime.lookup(key) };
  return storage.saveFile(key, file, options);
}

module.exports = {
  ASSET_ROOT,
  STORAGE_PROTOCOL,
  processStatics,
  resolveStatics
};
