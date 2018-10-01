import { getOccurrenceIndices } from './helpers';
import Highlight from './Highlight';
import Highlights from './Highlights';
import indexOf from 'lodash/indexOf';

export default class Wildcards {
  constructor(wildcards, text) {
    this.wildcards = wildcards;
    this.highlights = null;
    this.recalculateHighlights(text);
  }

  toPlainObjects() {
    const wildcards = this.getKeywords();
    return wildcards.map(wildcard => Highlight.toWildcardObject(wildcard));
  }

  getKeywords() {
    return this.wildcards;
  }

  getHighlights() {
    return this.highlights;
  }

  addWildcard(wildcard, text) {
    if (!this.wildcards.includes(wildcard)) this.wildcards.push(wildcard);
    this.recalculateHighlights(text);
  }

  removeWildcard(wildcard, text) {
    const index = indexOf(this.wildcards, wildcard);
    if (index !== -1) this.wildcards.splice(index, 1);
    this.recalculateHighlights(text);
  }

  recalculateHighlights(text) {
    let highlights = [];

    this.wildcards.forEach(wildcard => {
      const startIndices = getOccurrenceIndices(text, wildcard);
      startIndices.forEach(index => {
        highlights.push(new Highlight(index, wildcard));
      });
    });

    this.highlights = new Highlights(highlights);
  }
}
