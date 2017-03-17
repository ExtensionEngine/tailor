const crypto = require('crypto');
const mime = require('mime-types');
const Promise = require('bluebird');
const storage = require('./index');

const PRIMITIVES = ['TEXT', 'IMAGE', 'VIDEO', 'GOMO'];
const DEFAULT_IMAGE_EXTENSION = 'png';
const isPrimitive = asset => PRIMITIVES.indexOf(asset.type) > -1;

function processAsset(asset, courseId) {
  courseId = courseId || asset.courseId;
  return isPrimitive(asset)
    ? processPrimitive(asset, courseId)
    : processComposite(asset, courseId);
}

function processAssessment(assessment) {
  let question = assessment.data.question;
  if (!question || question.length < 1) return Promise.resolve(assessment);
  return Promise.each(question, it => processAsset(it, assessment.courseId));
}

function processPrimitive(primitive, courseId) {
  if (!isPrimitive(primitive)) throw new Error('Invalid primitive');
  if (!processor[primitive.type]) return Promise.resolve(primitive);
  return processor[primitive.type](primitive, courseId);
}

function processComposite(composite, courseId) {
  // TODO: Implement
  return Promise.resolve(composite);
}

let processor = {};

processor.IMAGE = (asset, courseId) => {
  const image = asset.data.url;
  const base64Pattern = /^data:image\/(\w+);base64,/;
  if (!image || !image.match(base64Pattern)) return Promise.resolve(asset);
  const file = Buffer.from(image.replace(base64Pattern, ''), 'base64');
  const extension = image.match(base64Pattern)[1] || DEFAULT_IMAGE_EXTENSION;
  const hashString = `${asset.id}${file}`;
  const hash = crypto.createHash('md5').update(hashString).digest('hex');
  const key = `/course/${courseId}/asset/${asset.id}/${hash}.${extension}`;
  asset.data.url = key;
  return saveFile(key, file).then(() => asset);
};

function resolveAsset(asset) {
  if (!isPrimitive(asset)) Promise.resolve(asset);
  if (!resolver[asset.type]) return Promise.resolve(asset);
  return resolver[asset.type](asset);
}

function resolveAssessment(assessment) {
  let question = assessment.data.question;
  if (!question || question.length < 1) return Promise.resolve(assessment);
  return Promise.each(question, it => resolveAsset(it)).then(() => assessment);
}

let resolver = {};

resolver.IMAGE = asset => {
  if (!asset.data || !asset.data.url) return Promise.resolve(asset);

  function getUrl(key) {
    return storage.getFileUrl(key, { Expires: 3600 })
      .then(url => (asset.data.url = url))
      .then(() => asset);
  };

  return storage.fileExists(asset.data.url)
    .then(exists => exists ? getUrl(asset.data.url) : asset);
};

function saveFile(key, file) {
  const options = { ACL: 'public-read', ContentType: mime.lookup(key) };
  return storage.saveFile(key, file, options);
}

module.exports = {
  processAsset,
  processAssessment,
  resolveAsset,
  resolveAssessment
};
