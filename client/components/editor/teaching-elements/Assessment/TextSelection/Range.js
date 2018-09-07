import { extractIndex, isBlast } from './helpers';
import filter from 'lodash/filter';
import first from 'lodash/first';
import inRange from 'lodash/inRange';
import last from 'lodash/last';

const isText = node => node.nodeType === Node.TEXT_NODE;
const sort = (...values) => values.sort((a, b) => a - b);

export default class Range {
  constructor(start, end) {
    [start, end] = sort(start, end);
    this.start = start;
    this.end = end;
  }

  intersectsWith(range) {
    const limits = [this.start, this.end];
    return inRange(range.start, ...limits) || inRange(range.end - 1, ...limits);
  }

  static getFromDomSelection(selection = document.getSelection()) {
    if (!selection.rangeCount) return null;
    const range = selection.getRangeAt(0);
    const commonAncestor = getCommonAncestor(range);
    let words = commonAncestor.querySelectorAll('span.blast.word');
    words = filter(words, it => range.intersectsNode(it));
    if (!words.length) return null;
    return new Range(extractIndex(first(words)), extractIndex(last(words)) + 1);
  }

  static extract(node) {
    const range = node.getAttribute('range');
    return new Range(...range.split(',').map(Number));
  }
}

function getCommonAncestor(range) {
  let ancestor = range.commonAncestorContainer;
  while (isText(ancestor) || isBlast(ancestor)) {
    ancestor = ancestor.parentElement;
  }
  return ancestor;
}
