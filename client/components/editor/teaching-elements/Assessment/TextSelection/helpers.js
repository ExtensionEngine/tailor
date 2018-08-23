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
import reduce from 'lodash/reduce';
import sortedIndexBy from 'lodash/sortedIndexBy';

const blastClass = 'blast';
const blastSelector = 'span.blast';
const blastCustomClass = 'text-content';
const blastIdPrefix = 'text-content-';

const SelectionStatus = {
  CONTAINER: 'container',
  FIRST_SELECTED: 'first-selected',
  LAST_SELECTED: 'last-selected',
  LAST_TEXT: 'last-text',
  LAST: 'last',
  NOT_WORD: 'not-word',
  SELECTED: 'selected',
  SINGLE_SELECTED: 'single-selected',
  UNSELECTED: 'unselected'
};

export function getIndex(node) {
  const { id } = node;
  if (isEmpty(id)) return NaN;
  return Number(invoke(id, 'substring', blastIdPrefix.length));
}

export function blastContent(html) {
  const $ = window.jQuery;
  const container = document.createElement('div');
  const options = {
    customClass: blastCustomClass,
    generateIndexID: true
  };
  container.innerHTML = html;
  $(container).blast(options);
  return container;
}

export function getAttributes(node) {
  const { attributes } = node;
  if (!isNode(node) || isUndefined(attributes)) return {};
  const attributesMap = map(attributes, ({ name, value }) => ([ name, value ]));
  return fromPairs(attributesMap);
}

export function getSelectedWords() {
  const domSelection = document.getSelection();
  if (domSelection.rangeCount === 0) return [];
  const range = domSelection.getRangeAt(0);
  const root = range.commonAncestorContainer;
  let selection = invoke(root, 'querySelectorAll', blastSelector);
  selection = filter(selection, item => domSelection.containsNode(item));
  const startWord = range.startContainer.parentElement;
  const startIncluded = includes(selection, startWord);
  if (isBlast(startWord) && !startIncluded) selection = [startWord, ...selection];
  const endWord = range.endContainer.parentElement;
  const endIncluded = includes(selection, endWord);
  if (isBlast(endWord) && !endIncluded) selection = [...selection, endWord];
  if (isEmpty(selection)) return [];
  return [getIndex(first(selection)), getIndex(last(selection)) + 1];
}

export function groupNodes(rootNode, parent, selections) {
  const { childNodes } = parent;
  return reduce(childNodes, (groups, node) => {
    const status = getNodeSelectionStatus(rootNode, parent, selections, node);
    const selection = getNodeSelection(node, selections);
    const group = last(groups);
    const { nodes } = group;
    switch (status) {
      case SelectionStatus.CONTAINER:
        if (group.selection) {
          groups.push(node);
          groups.push({ nodes: [] });
        } else {
          nodes.push(node);
          groups.splice(-1, 0, ...nodes);
          group.nodes = [];
        }
        return groups;
      case SelectionStatus.NOT_WORD:
        nodes.push(node);
        return groups;
      case SelectionStatus.LAST:
        nodes.push(node);
        if (!group.selection) groups.splice(-1, 1, ...nodes);
        return groups;
      case SelectionStatus.LAST_TEXT:
        nodes.push(node);
        groups.splice(-1, 1, ...nodes);
        return groups;
      case SelectionStatus.UNSELECTED:
        nodes.push(node);
        groups.splice(-1, 0, ...nodes);
        group.nodes = [];
        return groups;
      case SelectionStatus.SINGLE_SELECTED:
        groups.splice(-1, 0, ...nodes);
        groups.splice(-1, 0, ({ nodes: [node], selection }));
        group.nodes = [];
        return groups;
      case SelectionStatus.FIRST_SELECTED:
        groups.splice(-1, 1, ...nodes);
        groups.push({ nodes: [node], selection });
        return groups;
      case SelectionStatus.LAST_SELECTED:
        nodes.push(node);
        group.selection = selection;
        groups.push({ nodes: [] });
        return groups;
      default:
        nodes.push(node);
        group.selection = selection;
        groups.push({ nodes: [], selection });
        return groups;
    }
  }, [{ nodes: [] }]);
}

export function isBlast(node) {
  if (!isNode(node)) return false;
  return invoke(node.classList, 'contains', blastClass);
}

export function isNode(node) {
  return node instanceof Node;
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

function lastText(rootNode, node) {
  const texts = rootNode.querySelectorAll('span');
  return node === last(texts);
}

function hasChildren(node) {
  if (!isNode(node)) return false;
  return node.hasChildNodes();
}

function getNodeSelection(node, selections) {
  if (!isNode(node)) return false;
  const index = getIndex(node);
  const check = curry(isOverlaped)(index);
  return find(selections, check);
}

function getNodeSelectionStatus(rootNode, parent, selections, node) {
  const { childNodes } = parent;
  const isLastNode = node === last(childNodes);
  const index = getIndex(node);
  const hasIndex = !isNaN(index);
  const selection = getNodeSelection(node, selections);
  const isFirst = index === first(selection);
  const isLast = (index === last(selection) - 1);
  const isSingle = last(selection) - first(selection) === 1;
  const isContainer = hasChildren(node);
  const isLastText = lastText(rootNode, node);
  if (!hasIndex && !isLastNode && isContainer) return SelectionStatus.CONTAINER;
  if (!hasIndex && !isLastNode) return SelectionStatus.NOT_WORD;
  if (isLastText && isLastNode) return SelectionStatus.LAST_TEXT;
  if (!hasIndex && isLastNode) return SelectionStatus.LAST;
  if (isUndefined(selection) && !isLastNode) return SelectionStatus.UNSELECTED;
  if (isUndefined(selection) && isLastNode) return SelectionStatus.LAST;
  if (isSingle) return SelectionStatus.SINGLE_SELECTED;
  if (isFirst) return SelectionStatus.FIRST_SELECTED;
  if (isLast) return SelectionStatus.LAST_SELECTED;
  return SelectionStatus.SELECTED;
}

function isOverlaped(index, selection) {
  const start = first(selection);
  const end = last(selection);
  return inRange(index, start, end);
}
