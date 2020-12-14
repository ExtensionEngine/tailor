'use strict';

const { elementRegistry } = require('../content-plugins');
const get = require('lodash/get');
const config = require('../../../config/server').storage;
const Promise = require('bluebird');
const proxy = require('./proxy');
const set = require('lodash/set');
const toPairs = require('lodash/toPairs');
const values = require('lodash/values');

const isPrimitive = element => !get(element, 'data.embeds');
const isQuestion = element => get(element, 'data.question');

function processStatics(item) {
  const customProcessor = elementRegistry.getStaticsHandler(item.type);
  return customProcessor
    ? customProcessor(item, defaultStaticsProcessor, processStatics)
    : defaultStaticsProcessor(item);
}

function defaultStaticsProcessor(item) {
  return isQuestion(item)
    ? processQuestion(item)
    : processAsset(item);
}

function processAsset(asset) {
  return isPrimitive(asset)
    ? processPrimitive(asset)
    : processComposite(asset);
}

function processQuestion(element) {
  const question = element.data.question;
  if (!question || question.length < 1) return Promise.resolve(element);
  return Promise.each(question, it => processAsset(it));
}

function processPrimitive(primitive) {
  if (!isPrimitive(primitive)) throw new Error('Invalid primitive');
  return Promise.resolve(primitive);
}

function processComposite(composite) {
  return Promise.each(values(composite.data.embeds), processPrimitive)
    .then(() => composite);
}

// TODO: Temp patch until asset embeding is unified
function resolveStatics(item) {
  const customResolver = elementRegistry.getStaticsHandler(item.type);
  return customResolver
    ? customResolver(item, defaultStaticsResolver, resolveStatics)
    : defaultStaticsResolver(item);
}

function defaultStaticsResolver(item) {
  return isQuestion(item)
    ? resolveQuestion(item)
    : resolveAsset(item);
}

async function resolveAssetsMap(element) {
  if (!get(element, 'data.assets')) return element;
  await Promise.map(toPairs(element.data.assets), ([key, url]) => {
    if (!url) return set(element.data, key, url);
    const isStorageResource = url.startsWith(config.protocol);
    const resolvedUrl = isStorageResource
      ? proxy.getFileUrl(url.substr(config.protocol.length, url.length))
      : url;
    set(element.data, key, resolvedUrl);
  });
  return element;
}

async function resolveQuestion(element) {
  await resolveAssetsMap(element);
  const question = element.data.question;
  if (!question || question.length < 1) return Promise.resolve(element);
  return Promise.each(question, resolveAsset).then(() => element);
}

function resolveAsset(element) {
  return isPrimitive(element)
    ? resolvePrimitive(element)
    : resolveComposite(element);
}

function resolvePrimitive(primitive) {
  if (!isPrimitive(primitive)) throw new Error('Invalid primitive');
  return resolveAssetsMap(primitive);
}

async function resolveComposite(composite) {
  await resolveAssetsMap(composite);
  return Promise.each(values(composite.data.embeds), resolvePrimitive)
    .then(() => composite);
}

module.exports = {
  processStatics,
  resolveStatics
};
