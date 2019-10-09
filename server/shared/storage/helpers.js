'use strict';

const crypto = require('crypto');
const { elementRegistry } = require('../../content-plugin-registry');
const { getFileUrl } = require('./');
const isString = require('lodash/isString');
const isUrl = require('is-url');
const mime = require('mime-types');
const Promise = require('bluebird');
const storage = require('./index');
const toPairs = require('lodash/toPairs');
const values = require('lodash/values');

const ASSET_ROOT = 'repository/assets';
const STORAGE_PROTOCOL = 'storage://';
const DEFAULT_IMAGE_EXTENSION = 'png';
const PRIMITIVES = [
  'HTML',
  'FILE',
  'IMAGE',
  'VIDEO',
  'BRIGHTCOVE_VIDEO',
  'TABLE-CELL',
  'EMBED'
];

const isPrimitive = asset => PRIMITIVES.indexOf(asset.type) > -1;
const isQuestion = type => ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);

function processStatics(item) {
  const customProcessor = elementRegistry.getStaticsHandler(item.type);
  return customProcessor
    ? customProcessor(item, defaultStaticsProcessor, processStatics)
    : defaultStaticsProcessor(item);
}

function defaultStaticsProcessor(item) {
  return isQuestion(item.type)
    ? processQuestion(item)
    : processAsset(item);
}

function processAsset(asset) {
  return isPrimitive(asset) ? processPrimitive(asset) : processComposite(asset);
}

function processQuestion(element) {
  const question = element.data.question;
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

const processor = {};

processor.IMAGE = asset => {
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
  const key = `${ASSET_ROOT}/${asset.id}/${hash}.${extension}`;
  asset.data.url = key;
  return saveFile(key, file).then(() => asset);
};

// TODO: Temp patch until asset embeding is unified
function resolveStatics(item) {
  const customResolver = elementRegistry.getStaticsHandler(item.type);
  return customResolver
    ? customResolver(item, defaultStaticsResolver, resolveStatics)
    : defaultStaticsResolver(item);
}

async function defaultStaticsResolver(item) {
  const element = await (isQuestion(item.type)
    ? resolveQuestion(item)
    : resolveAsset(item));
  if (!element.data.assets) return element;
  await Promise.map(toPairs(element.data.assets), async ([key, url]) => {
    const isStorageResource = url.startsWith(STORAGE_PROTOCOL);
    element.data[key] = isStorageResource
      ? (await getFileUrl(url.substr(STORAGE_PROTOCOL.length, url.length)))
      : url;
  });
  return element;
}

function resolveQuestion(element) {
  const question = element.data.question;
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

const resolver = {};

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

resolver.FILE = asset => {
  if (!asset.data || !asset.data.key) return Promise.resolve(asset);

  const ResponseContentDisposition = asset.data.name
    ? `attachment; filename="${asset.data.name}"`
    : 'attachment';

  const options = { ResponseContentDisposition, Expires: 3600 };
  return storage.getFileUrl(asset.data.key, options)
    .then(url => (asset.data.url = url))
    .then(() => asset)
    .catch(() => asset);
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
