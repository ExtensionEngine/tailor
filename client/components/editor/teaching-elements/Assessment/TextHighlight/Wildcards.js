import { getOccurrenceIndices } from './helpers';
import Highlight from './Highlight';
import Highlights from './Highlights';
import indexOf from 'lodash/indexOf';

export default class Wildcards {
  constructor(wildcards, text) {
    this.keywords = wildcards;
    this.highlights = null;
    this.recalculateHighlights(text);
  }

  toPlainObjects() {
    return this.keywords.map(wildcard => Highlight.toWildcardObject(wildcard));
  }

  addWildcard(wildcard, text) {
    if (!this.keywords.includes(wildcard)) this.keywords.push(wildcard);
    this.recalculateHighlights(text);
  }

  removeWildcard(wildcard, text) {
    const index = indexOf(this.keywords, wildcard);
    if (index !== -1) this.keywords.splice(index, 1);
    this.recalculateHighlights(text);
  }

  recalculateHighlights(text) {
    let highlights = [];

    this.keywords.forEach(wildcard => {
      getOccurrenceIndices(text, wildcard).forEach(index => {
        highlights.push(new Highlight(index, wildcard));
      });
    });

    this.highlights = new Highlights(highlights);
  }
}
