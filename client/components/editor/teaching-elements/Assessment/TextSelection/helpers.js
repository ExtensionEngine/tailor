import curry from 'lodash/curry';
import curryRight from 'lodash/curryRight';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import fromPairs from 'lodash/fromPairs';
import includes from 'lodash/includes';
import inRange from 'lodash/inRange';
import invoke from 'lodash/invoke';
import isEmpty from 'lodash/isEmpty';
import isUndefined from 'lodash/isUndefined';
import last from 'lodash/last';
import map from 'lodash/map';
import sortedIndexBy from 'lodash/sortedIndexBy';

const blastClass = 'blast';
const wordClass = 'word';
const blastWordSelector = `span.blast.word`;
const idPrefix = 'text-content-';

const isNode = node => node instanceof Node;

export function getIndex(node) {
  const { id } = node;
  if (isEmpty(id)) return NaN;
  return Number(invoke(id, 'substring', idPrefix.length));
}

export function isBlastWord(node) {
  if (!isBlast(node)) return false;
  return invoke(node.classList, 'contains', wordClass);
}

export function blastContent(html) {
  const $ = window.jQuery;
  const container = document.createElement('div');
  container.innerHTML = html;
  $(container).blast();
  const iterator = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (iterator.nextNode()) { nodes.push(iterator.referenceNode); }
  let index = 0;
  nodes.forEach(node => {
    let span = document.createElement('span');
    if (isBlast(node.parentElement)) {
      span = node.parentElement;
      span.classList.add('word');
    } else {
      span.textContent = node.textContent;
      node.replaceWith(span);
      span.classList.add('blast');
    }
    span.id = `${idPrefix}${index++}`;
  });
  return container;
}

export function getAttributes(node) {
  const { attributes } = node;
  if (!isNode(node) || isUndefined(attributes)) return {};
  const attributesMap = map(attributes, ({ name, value }) => ([ name, value ]));
  return fromPairs(attributesMap);
}

export function isSelected(node, selection) {
  return !!getNodeSelection(node, selection);
}

export function getSelectedWords() {
  const domSelection = document.getSelection();
  if (domSelection.rangeCount === 0) return [];
  const range = domSelection.getRangeAt(0);
  if (range.startContainer === range.endContainer) return [];
  const root = range.commonAncestorContainer;
  let selection = invoke(root, 'querySelectorAll', blastWordSelector);
  selection = filter(selection, item => domSelection.containsNode(item));
  const startWord = range.startContainer.parentElement;
  const startIncluded = includes(selection, startWord);
  if (isBlastWord(startWord) && !startIncluded) selection = [startWord, ...selection];
  const endWord = range.endContainer.parentElement;
  const endIncluded = includes(selection, endWord);
  if (isBlastWord(endWord) && !endIncluded) selection = [...selection, endWord];
  if (isEmpty(selection)) return [];
  return [getIndex(first(selection)), getIndex(last(selection)) + 1];
}

export function isBlast(node) {
  if (!isNode(node)) return false;
  return invoke(node.classList, 'contains', blastClass);
}

export function mergeSelection(selections, selection) {
  if (isUndefined(selection)) return selections;
  const begin = first(selection);
  const end = last(selection);
  const final = end - 1;
  const check = curry(isOverlaped);
  const beginOverlap = find(selections, check(begin));
  const endOverlap = find(selections, check(final));
  const range = [first(beginOverlap) || begin, last(endOverlap) || end];
  selections = removeSelection(selections, range);
  const index = sortedIndexBy(selections, range, first);
  selections.splice(index, 0, range);
  return selections;
}

export function removeSelection(selections, selection) {
  const check = curryRight(isOverlaped)(selection);
  return filter(selections, range => (
    !check(first(range)) &&
    !check(last(range) - 1)
  ));
}

export function getNodeSelection(node, selections) {
  if (!isNode(node)) return false;
  const index = getIndex(node);
  const check = curry(isOverlaped)(index);
  return find(selections, check);
}

function isOverlaped(index, selection) {
  const start = first(selection);
  const end = last(selection);
  return inRange(index, start, end);
}
