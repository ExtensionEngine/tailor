import findIndex from 'lodash/findIndex';
import Highlight from './Highlight';
import Highlights from './Highlights';
import isEmpty from 'lodash/isEmpty';

export function adjustForWildcards(highlight, wildcards) {
  highlight.isWildcard = wildcards.includes(highlight.text);
  return highlight;
}

export function findNearbyHighlights(highlight, highlights) {
  const related = { inner: [], outer: {}, containing: null };

  highlights.forEach(it => {
    if (it.contains(highlight)) return (related.containing = it);
    if (highlight.equals(it) || highlight.contains(it)) {
      return related.inner.push(it);
    }
    if (highlight.bordersFromLeft(it)) related.outer.left = it;
    if (highlight.bordersFromRight(it)) related.outer.right = it;
  });

  return related;
}

function getOccurrenceIndices(text, wildcard) {
  const regex = new RegExp(wildcard);
  let indices = [];
  const indexModifier = wildcard.length - 1;

  let match = text.match(regex);
  if (!match || !match.index) return indices;

  let { index: currentIndex } = match;

  while (currentIndex) {
    if (!indices.includes(currentIndex)) indices.push(currentIndex);
    currentIndex += indexModifier;
    const match = text.substring(currentIndex).match(regex);
    currentIndex = (match && match.index) ? currentIndex + match.index : null;
  }

  return indices;
}

export function getPlainContent(text) {
  const temp = document.createElement('div');
  let preparedText = String(text).replace(/<p>/g, '');
  preparedText = preparedText.replace(/<br>/g, '');
  preparedText = preparedText.replace(/<\/p>/g, '\n');

  temp.innerHTML = preparedText;

  return temp.innerText;
}

export function getWildcardHighlights(wildcard, text) {
  if (!wildcard || !text.length) return [];

  let highlights = [];

  getOccurrenceIndices(text, wildcard).forEach(index => {
    highlights.push(new Highlight(index, wildcard, true));
  });

  return highlights;
}

export function isHighlightValid(highlight, text) {
  return highlight.text === text.substring(highlight.start, highlight.end + 1);
}

export function isValidWildcard(highlight, wildcards) {
  return highlight.isWildcard && wildcards.includes(highlight.text);
}

export function mapPlainObjectsToHighlights(objects, text) {
  let highlights = [];
  let wildcards = [];

  objects.forEach(it => {
    if (Highlight.isWildcardObject(it)) {
      highlights.push(...getWildcardHighlights(it.text, text));
      return wildcards.push(it.text);
    }
    highlights.push(new Highlight(it.start, it.text));
  });

  return new Highlights(highlights, wildcards);
}

export function removeWildcardKeyword(wildcard, wildcards) {
  const index = wildcards.indexOf(wildcard);
  if (index !== -1) wildcards.splice(index, 1);
}

export function safelyRemove(highlights, index, wildcards) {
  const highlight = highlights[index];
  highlights.splice(index, 1);
  if (!highlight.isWildcard) return;

  const wildcard = { text: highlight.text, isWildcard: true };
  const noWildcards = findIndex(highlights, wildcard) === -1;
  if (noWildcards) removeWildcardKeyword(highlight.text, wildcards);
}

export function trimHighlight({ highlight, isAdding }, neighbors, wildcards) {
  if (isEmpty(neighbors)) return adjustForWildcards(highlight, wildcards);

  if (isAdding) return highlight.absorb(neighbors, wildcards);

  const { left, right } = neighbors;
  if (left) left.trim(highlight, wildcards);
  if (right) right.trim(highlight, wildcards);
}

export function updateHighlight(highlight, text, change) {
  const start = highlight.start + change.modifier;
  const end = start + highlight.length;

  if (text.substring(start, end) !== highlight.text) return false;

  highlight.start = start;
  return true;
}
