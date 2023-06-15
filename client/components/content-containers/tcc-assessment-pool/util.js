import info from './info';
import pick from 'lodash/pick';
import Promise from 'bluebird';

const ATTRS = [
  'id', 'uid', 'type', 'position', 'parentId', 'createdAt', 'updatedAt'
];

async function fetchContainer(container) {
  const elements = await container.getContentElements({ raw: true });
  return { ...pick(container, ATTRS), elements };
}

function fetch(parent, type) {
  const opts = { where: { type } };
  return parent.getChildren(opts).map(fetchContainer);
}

async function resolve(container, resolveStatics) {
  container.elements = await Promise.map(container.elements, resolveStatics);
  return container;
}

module.exports = {
  ...info,
  fetch,
  resolve
};
