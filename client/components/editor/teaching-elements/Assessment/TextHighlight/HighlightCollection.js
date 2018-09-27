import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export default class HighlightCollection {
  constructor(highlights = []) {
    this.highlights = highlights;
  }

  static fromPlainObjects(objects) {
    const highlights = map(objects, o => Highlight.fromPlainObject(o));
    return new HighlightCollection(highlights);
  }

  toPlainObjects() {
    const sorted = sortBy(this.highlights, h => h.start);
    return map(sorted, h => h.toPlainObject());
  }

  addHighlight(startIndex, text) {
    const highlight = new Highlight(startIndex, text);
    const existingIndex = findIndex(this.highlights, highlight);
    if (existingIndex !== -1) return;

    this.add(highlight);
  }

  add(highlight) {
    const { inner, outer, containing } = this.getNearby(highlight);

    if (containing) return;

    this.trimHighlight(highlight, outer, true);

    const outerHighlights = isEmpty(outer) ? [] : Object.values(outer);
    this.removeHighlights(inner.concat(outerHighlights));

    this.highlights.push(highlight);
  }

  removeHighlight(startIndex, text) {
    this.remove(new Highlight(startIndex, text));
  }

  remove(highlight) {
    const existingIndex = findIndex(this.highlights, highlight);
    if (existingIndex !== -1) return this.highlights.splice(existingIndex, 1);

    const { inner, outer, containing } = this.getNearby(highlight);

    if (containing) {
      const split = containing.splitBy(highlight);
      this.removeHighlights([containing, highlight]);

      return this.highlights.push(...split);
    }

    this.trimHighlight(highlight, outer, false);
    this.removeHighlights(inner);
  }

  removeHighlights(highlights) {
    forEach(highlights, h => this.remove(h));
  }

  trimHighlight(highlight, neighbors, isAdding) {
    if (isEmpty(neighbors)) return;

    if (isAdding) return highlight.absorb(neighbors);

    const { left, right } = neighbors;
    if (left) left.rightTrim(highlight);
    if (right) right.leftTrim(highlight);
  }

  updateForText(text) {
    forEachRight(this.highlights, it => {
      if (!it.isAppropriate(text)) this.remove(it);
    });
  }

  getNearby(highlight) {
    const related = { inner: [], outer: {}, containing: null };

    forEach(this.highlights, h => {
      if (highlight.isContainedBy(h)) return (related.containing = h);
      if (highlight.containsOrEquals(h)) return related.inner.push(h);
      if (highlight.bordersFromLeft(h)) related.outer.left = h;
      if (highlight.bordersFromRight(h)) related.outer.right = h;
    });

    return related;
  }
}
