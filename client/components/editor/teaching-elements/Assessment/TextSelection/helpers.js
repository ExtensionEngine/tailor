import Blast from 'blast-vanilla';
import forEach from 'lodash/forEach';

const blastClass = 'blast';

export const isSelected = node => node.hasAttribute('range');

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

export function getText(container, range) {
  const length = range.end - range.start;
  const selectors = Array.from({ length }, (_, offset) => {
    const index = range.start + offset;
    return `span.${blastClass}[id$="-${index}"]`;
  });
  return Array.from(container.querySelectorAll(selectors.join(',')));
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
  const range = selections.getByIndex(index);
  if (!range) return node;
  node.classList.add('selected');
  node.setAttribute('range', [range.start, range.end]);
  return node;
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
  span.id = `text-${index}`;
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
