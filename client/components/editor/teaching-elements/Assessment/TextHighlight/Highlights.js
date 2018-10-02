import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

export default class Highlights {
  constructor(highlights = []) {
    this.highlights = highlights;
  }

  static fromPlainObjects(objects) {
    const highlights = map(objects, it => Highlight.fromPlainObject(it));
    return new Highlights(highlights);
  }

  toPlainObjects() {
    const sorted = sortBy(this.highlights, it => it.start);
    return map(sorted, it => it.toPlainObject());
  }

  addHighlight(startIndex, text) {
    const highlight = new Highlight(startIndex, text);
    if (findIndex(this.highlights, highlight) === -1) this.add(highlight);
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
    forEach(highlights, it => this.remove(it));
  }

  trimHighlight(highlight, neighbors, isAdding) {
    if (isEmpty(neighbors)) return;

    if (isAdding) return highlight.absorb(neighbors);

    const { left, right } = neighbors;
    if (left) left.trim(highlight);
    if (right) right.trim(highlight);
  }

  updateForText(text) {
    forEachRight(this.highlights, it => {
      if (!it.isAppropriate(text)) this.remove(it);
    });
  }

  getNearby(highlight) {
    const related = { inner: [], outer: {}, containing: null };

    forEach(this.highlights, it => {
      if (it.contains(highlight)) return (related.containing = it);
      if (highlight.equals(it) || highlight.contains(it)) {
        return related.inner.push(it);
      }
      if (highlight.bordersFromLeft(it)) related.outer.left = it;
      if (highlight.bordersFromRight(it)) related.outer.right = it;
    });

    return related;
  }
}
