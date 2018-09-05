import Blast from 'blast-vanilla';
import forEach from 'lodash/forEach';
import generateRange from 'lodash/range';

const blastClass = 'blast';
const idPrefix = 'text-';

export function generateHtml(content, iteratee) {
  if (!content) return '';
  const container = document.createElement('div');
  container.innerHTML = content;
  // eslint-disable-next-line no-new
  new Blast(container);
  const nodes = filterNodes(container, NodeFilter.SHOW_TEXT);
  nodes.forEach(iteratee);
  return container.innerHTML;
}

export function isBlast(node) {
  if (!(node instanceof HTMLSpanElement)) return false;
  return node.classList.contains(blastClass);
}

export function getText(element, range) {
  const query = index => `span#${idPrefix}${index}.${blastClass}`;
  const indexes = generateRange(...range);
  return indexes.map(index => element.querySelector(query(index)));
}

export function toggleAttributes(element, config) {
  forEach(config, (value, name) => {
    const action = value !== null ? 'setAttribute' : 'removeAttribute';
    element[action](name, value);
  });
}

export function toggleClasses(element, config) {
  forEach(config, (value, name) => {
    element.classList.toggle(name, value);
  });
}

export function processNode(node, selections) {
  const index = extractIndex(node);
  const selection = selections.getByIndex(index);
  if (!selection) return node;
  node.classList.add('selected');
  node.setAttribute('range', [...selection]);
  return node;
}

export function isSelected(node) {
  return node.hasAttribute('range');
}

export function nodeMapper(chain, node, index) {
  let span;
  if (isBlast(node.parentElement)) {
    span = node.parentElement;
    span.classList.add('word');
  } else {
    span = document.createElement('span');
    span.textContent = node.textContent;
    node.replaceWith(span);
    span.classList.add(blastClass);
  }
  span.id = `${idPrefix}${index}`;
  chain(span);
}

export function extractIndex(node) {
  const [, index] = node.id.split('-');
  return parseInt(index, 10);
}

function filterNodes(rootNode, nodeFilter) {
  const iterator = document.createNodeIterator(rootNode, nodeFilter);
  const nodes = [];
  while (iterator.nextNode()) { nodes.push(iterator.referenceNode); }
  return nodes;
}
