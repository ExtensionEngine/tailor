const info = require('./info');
const pick = require('lodash/pick');
const Promise = require('bluebird');

const ATTRS = [
  'id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'
];

async function fetchContainer(block) {
  const elements = await block.getContentElements({ raw: true });
  return { ...pick(block, ATTRS), elements };
}

function fetch(parent) {
  const opts = { where: { type: info.type } };
  return parent.getChildren(opts).map(fetchContainer);
}

async function resolve(block, resolveStatics) {
  block.elements = await Promise.map(block, resolveStatics);
  return block;
}

module.exports = {
  ...info,
  fetch,
  resolve
};
