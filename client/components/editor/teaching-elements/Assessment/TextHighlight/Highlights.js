import filter from 'lodash/filter';
import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import forEach from 'lodash/forEach';
import forEachRight from 'lodash/forEachRight';
import Highlight from './Highlight';
import inRange from 'lodash/inRange';
import isEmpty from 'lodash/isEmpty';
import { isHighlightValid, getWildcardHighlights } from './helpers';
import sortBy from 'lodash/sortBy';

export default class Highlights {
  constructor(items = [], wildcards = []) {
    this.items = items;
    this.wildcards = wildcards;
  }

  get highlights() {
    const highlights = filter(this.items, it => !it.isWildcard);
    return sortBy(highlights, highlight => highlight.start);
  }

  toPlainObjects() {
    let highlights = this.highlights.map(it => it.toPlainObject());
    this.wildcards.forEach(it => highlights.push(Highlight.toWildcardObject(it)));
    return highlights;
  }

  addWildcard(wildcard, text) {
    if (!wildcard || !text) return;
    if (this.wildcards.includes(wildcard)) return;

    this.wildcards.push(wildcard);
    getWildcardHighlights(wildcard, text).forEach(it => this.addHighlight(it));
  }

  addHighlight(highlight) {
    if (findIndex(this.items, highlight) !== -1) return;

    const { inner, outer, containing } = this.getNearby(highlight);
    if (containing) return;

    this.trimHighlight(highlight, outer, true);

    const outerHighlights = isEmpty(outer) ? [] : Object.values(outer);
    this.removeHighlights(inner.concat(outerHighlights));

    this.items.push(highlight);
  }

  removeWildcard(wildcard, text) {
    if (!wildcard) return;
    if (!this.wildcards.includes(wildcard)) return;

    const shouldRemove = it => it.isWildcard && it.text === wildcard;
    this.removeHighlights(filter(this.items, it => shouldRemove(it)));

    this.wildcards.splice(findIndex(this.wildcards, wildcard), 1);
  }

  removeHighlight(highlight) {
    const existingIndex = findIndex(this.items, highlight);
    if (existingIndex !== -1) return this.items.splice(existingIndex, 1);

    const { inner, outer, containing } = this.getNearby(highlight);

    if (containing) {
      const split = containing.splitBy(highlight);
      this.removeHighlights([containing, highlight]);

      return this.items.push(...split);
    }

    this.trimHighlight(highlight, outer, false);
    this.removeHighlights(inner);
  }

  removeHighlights(highlights) {
    forEach(highlights, it => this.removeHighlight(it));
  }

  trimHighlight(highlight, neighbors, isAdding) {
    if (isEmpty(neighbors)) return;

    if (isAdding) return highlight.absorb(neighbors);

    const { left, right } = neighbors;
    if (left) left.trim(highlight);
    if (right) right.trim(highlight);
  }

  findByTextIndex(index) {
    const highlight = find(this.highlights, it => {
      return inRange(index, it.start, it.end + 1);
    });
    return highlight || null;
  }

  updateForText(text) {
    forEachRight(this.items, it => {
      if (!isHighlightValid(it, text)) this.removeHighlight(it);
    });
  }

  getNearby(highlight) {
    const related = { inner: [], outer: {}, containing: null };

    forEach(this.items, it => {
      // TODO: change neighbor handling so that adding a wildcard does not
      // result in removing the highlights that contain the wildcard text
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
