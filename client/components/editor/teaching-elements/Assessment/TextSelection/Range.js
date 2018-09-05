import { extractIndex } from './helpers';
import filter from 'lodash/filter';
import first from 'lodash/first';
import inRange from 'lodash/inRange';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';

export default class Range {
  constructor(start, end) {
    [start, end] = sortBy([start, end]);
    this[0] = start;
    this[1] = end;
  }

  [Symbol.iterator]() { return [this.start, this.end].values(); }

  intersectsWith(range) {
    const limits = [this.start, this.end];
    return inRange(range.start, ...limits) || inRange(range.end - 1, ...limits);
  }

  get start() {
    return this[0];
  }

  set start(val) {
    this[0] = val;
  }

  get end() {
    return this[1];
  }

  set end(val) {
    this[1] = val;
  }

  static getFromDomSelection(selection = document.getSelection()) {
    if (!selection.rangeCount) return null;
    const selRange = selection.getRangeAt(0);
    const { parentElement } = selRange.commonAncestorContainer.parentElement;
    let words = parentElement.querySelectorAll('span.blast.word');
    words = filter(words, it => selRange.intersectsNode(it));
    if (!words.length) return null;
    return new Range(extractIndex(first(words)), extractIndex(last(words)) + 1);
  }

  static extract(node) {
    const range = node.getAttribute('range');
    return new Range(...range.split(',').map(Number).sort().reverse());
  }
}
