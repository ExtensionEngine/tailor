import Blast from 'blast-vanilla';
import first from 'lodash/first';
import generateRange from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import forEach from 'lodash/forEach';

const blastClass = 'blast';
const wordClass = 'word';
const idPrefix = 'text-';

const isText = node => node.nodeType === Node.TEXT_NODE;

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

export function getSelectionRange() {
  const selector = `span.${blastClass}.${wordClass}`;
  const domSelection = document.getSelection();
  if (!domSelection.rangeCount) return null;
  const range = domSelection.getRangeAt(0);
  const start = range.startContainer;
  const end = range.endContainer;
  let selection;
  if (start === end && isText(start)) {
    const word = range.startContainer.parentElement;
    selection = isBlastWord(word) ? [word] : [];
  } else {
    const root = range.commonAncestorContainer;
    selection = Array.from(root.querySelectorAll(selector));
    selection = selection.filter(item => domSelection.containsNode(item));
  }
  const startWord = range.startContainer.parentElement;
  const endWord = range.endContainer.parentElement;
  if (wordIsTarget(selection, startWord)) selection = [startWord, ...selection];
  if (wordIsTarget(selection, endWord)) selection = [...selection, endWord];
  if (isEmpty(selection)) return null;
  selection = [extractIndex(first(selection)), extractIndex(last(selection)) + 1];
  return Object.assign(selection, { isCollapsed: domSelection.isCollapsed });
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
  node.setAttribute('range', selection);
  return node;
}

export function extractRange(node) {
  const range = node.getAttribute('range');
  return range.split(',').map(Number);
}

export function isSelected(node) {
  return node.hasAttribute('range');
}

export function nodeMapper(chain, node, index) {
  let span;
  if (isBlast(node.parentElement)) {
    span = node.parentElement;
    span.classList.add(wordClass);
  } else {
    span = document.createElement('span');
    span.textContent = node.textContent;
    node.replaceWith(span);
    span.classList.add(blastClass);
  }
  span.id = `${idPrefix}${index}`;
  chain(span);
}

function isBlastWord(node) {
  if (!isBlast(node)) return false;
  return node.classList.contains(wordClass);
}

function filterNodes(rootNode, nodeFilter) {
  const iterator = document.createNodeIterator(rootNode, nodeFilter);
  const nodes = [];
  while (iterator.nextNode()) { nodes.push(iterator.referenceNode); }
  return nodes;
}

function wordIsTarget(selection, word) {
  const included = selection.includes(word);
  const isBlast = isBlastWord(word);
  return isBlast && !included;
}

function extractIndex(node) {
  const [, index] = node.id.split('-');
  return parseInt(index, 10);
}
