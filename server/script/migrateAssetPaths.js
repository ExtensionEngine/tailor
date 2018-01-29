const filter = require('lodash/filter');
const get = require('lodash/get');
const Promise = require('bluebird');
const storage = require('../shared/storage');
const { TeachingElement } = require('../shared/database');

const LEGACY_IMAGE_PATH = /course\/\d+\/asset\//;

async function migrateImages() {
  const images = await TeachingElement.findAll({ where: { type: 'IMAGE' } });
  return Promise.map(images, updateImageComponent);
}

async function migrateComposites() {
  const opts = { where: { type: { $in: ['CAROUSEL', 'ACCORDION', 'MODAL'] } } };
  const composites = await TeachingElement.findAll(opts);
  return Promise.map(composites, migrateComposite);
}

async function migrateAssessments() {
  const opts = { where: { type: 'ASSESSMENT' } };
  const assessments = await TeachingElement.findAll(opts);
  await Promise.map(assessments, it => migrateComposite(it, 'question'));
}

async function migrateComposite(item, key = 'embeds') {
  const embeds = filter(get(item, `data.${key}`, []), { type: 'IMAGE' });
  if (!embeds.length) return item;
  await Promise.each(embeds, updateImagePath);
  item.changed('data', true);
  return item.save();
}

async function updateImageComponent(component) {
  const hasChanged = await updateImagePath(component);
  if (!hasChanged) return;
  component.changed('data', true);
  return component.save();
}

async function updateImagePath(image) {
  const url = get(image, 'data.url');
  if (!url || (url.indexOf(LEGACY_IMAGE_PATH) === -1)) return false;
  let newUrl = url.replace(LEGACY_IMAGE_PATH, 'repository/assets/');
  await storage.copyFile(url, newUrl);
  image.data.url = newUrl;
  return true;
}

async function migrateAssetPaths() {
  await migrateImages();
  await migrateComposites();
  await migrateAssessments();
  return true;
};

module.exports = {
  migrateAssetPaths
};
