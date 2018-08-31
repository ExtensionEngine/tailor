import Blast from 'blast-vanilla';
import first from 'lodash/first';
import generateRange from 'lodash/range';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';

const blastClass = 'blast';
const wordClass = 'word';
const blastWordSelector = `span.${blastClass}.${wordClass}`;
const idPrefix = 'text-';

const isText = node => node.nodeType === Node.TEXT_NODE;

export const isSelected = node => node.hasAttribute('range');

export function extractIndex(node) {
  const index = node.id.substr(idPrefix.length);
  return parseInt(index, 10);
}

export function generateStructure(content, mapper) {
  if (!content) return '';
  const container = document.createElement('div');
  container.innerHTML = content;
  // eslint-disable-next-line no-new
  new Blast(container);
  const iterator = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (iterator.nextNode()) { nodes.push(iterator.referenceNode); }
  nodes.forEach(mapper);
  return container.innerHTML;
}

export function getSelectedWords() {
  const domSelection = document.getSelection();
  if (!domSelection.rangeCount) return [];
  const range = domSelection.getRangeAt(0);
  const start = range.startContainer;
  const end = range.endContainer;
  let selection;
  if (start === end && isText(start)) {
    const word = range.startContainer.parentElement;
    selection = isBlastWord(word) ? [word] : [];
  } else {
    const root = range.commonAncestorContainer;
    selection = Array.from(root.querySelectorAll(blastWordSelector));
    selection = selection.filter(item => domSelection.containsNode(item));
  }
  const startWord = range.startContainer.parentElement;
  const endWord = range.endContainer.parentElement;
  if (wordIsTarget(selection, startWord)) selection = [startWord, ...selection];
  if (wordIsTarget(selection, endWord)) selection = [...selection, endWord];
  if (isEmpty(selection)) return [];
  return [extractIndex(first(selection)), extractIndex(last(selection)) + 1];
}

export function isBlast(node) {
  if (!(node instanceof HTMLSpanElement)) return false;
  return node.classList.contains(blastClass);
}

export function modifySelectionNodes(element, range, options) {
  const query = index => `span#${idPrefix}${index}.${blastClass}`;
  const indexes = generateRange(...range);
  const nodes = indexes.map(index => element.querySelector(query(index)));
  nodes.forEach(node => {
    if (options.addClass) node.classList.add(options.addClass);
    if (options.removeClass) node.classList.remove(options.removeClass);
    if (options.setAttribute) {
      const { name, value } = options.setAttribute;
      node.setAttribute(name, value);
    }
    if (options.removeAttribute) node.removeAttribute(options.removeAttribute);
  });
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

function wordIsTarget(selection, word) {
  const included = selection.includes(word);
  const isBlast = isBlastWord(word);
  return isBlast && !included;
}
