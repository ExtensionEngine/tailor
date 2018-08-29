import Blast from 'blast-vanilla';
import cloneDeep from 'lodash/cloneDeep';
import curry from 'lodash/curry';
import curryRight from 'lodash/curryRight';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import generateRange from 'lodash/range';
import inRange from 'lodash/inRange';
import isEmpty from 'lodash/isEmpty';
import last from 'lodash/last';
import sortedIndexBy from 'lodash/sortedIndexBy';

const blastClass = 'blast';
const blastSelector = 'span.blast';
const blastWordSelector = 'span.blast.word';
const wordClass = 'word';

const NodeType = { TEXT: 3 };
const getIndex = (node) => Number(node.id);
const isText = node => node.nodeType === NodeType.TEXT;

export const isSelected = (node) => node.hasAttribute('range');

export function blastContent(html, selections) {
  const container = document.createElement('div');
  container.innerHTML = html;
  // eslint-disable-next-line no-new
  new Blast(container);
  const iterator = document.createNodeIterator(container, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (iterator.nextNode()) { nodes.push(iterator.referenceNode); }
  nodes.forEach((node, index) => {
    let span;
    if (isBlast(node.parentElement)) {
      span = node.parentElement;
      span.classList.add('word');
    } else {
      span = document.createElement('span');
      span.textContent = node.textContent;
      node.replaceWith(span);
      span.classList.add('blast');
    }
    const selection = getSelectionByIndex(index, selections);
    if (selection) {
      span.classList.add('selected');
      span.setAttribute('range', selection);
    }
    span.id = `${index}`;
  });
  return container;
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
  return [getIndex(first(selection)), getIndex(last(selection)) + 1];
}

export function getSelection(node) {
  const range = node.getAttribute('range');
  return range.split(',').map(Number);
}

export function isBlast(node) {
  if (!(node instanceof HTMLSpanElement)) return false;
  return node.classList.contains(blastClass);
}

export function modifySelectionNodes(element, range, options) {
  const query = index => `${blastSelector}[id="${index}"]`;
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

export const Selection = {
  merge(selections, selection) {
    selections = cloneDeep(selections);
    const begin = first(selection);
    const end = last(selection);
    const final = end - 1;
    const check = curry(isOverlaped);
    const beginOverlap = find(selections, check(begin));
    const endOverlap = find(selections, check(final));
    const range = [first(beginOverlap) || begin, last(endOverlap) || end];
    selections = this.remove(selections, range);
    const index = sortedIndexBy(selections, range, first);
    selections.splice(index, 0, range);
    return { selections, range };
  },
  remove(selections, selection) {
    selections = cloneDeep(selections);
    const check = curryRight(isOverlaped)(selection);
    return filter(selections, range => (
      !check(first(range)) &&
      !check(last(range) - 1)
    ));
  }
};

function isBlastWord(node) {
  if (!isBlast(node)) return false;
  return node.classList.contains(wordClass);
}

function isOverlaped(index, selection) {
  const start = first(selection);
  const end = last(selection);
  return inRange(index, start, end);
}

function getSelectionByIndex(index, selections) {
  const check = curry(isOverlaped)(index);
  return selections.find(check);
}

function wordIsTarget(selection, word) {
  const included = selection.includes(word);
  const isBlast = isBlastWord(word);
  return isBlast && !included;
}
