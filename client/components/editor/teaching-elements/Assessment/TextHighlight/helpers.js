import Highlight from './Highlight';
import Highlights from './Highlights';

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

export function isHighlightValid(highlight, text) {
  return highlight.text === text.substring(highlight.start, highlight.end + 1);
}

export function updateHighlight(highlight, text, change) {
  const start = highlight.start + change.modifier;
  const end = start + highlight.length;

  if (text.substring(start, end) !== highlight.text) return false;

  highlight.start = start;
  return true;
}

export function getWildcardHighlights(wildcard, text) {
  if (!wildcard || !text.length) return [];

  let highlights = [];

  getOccurrenceIndices(text, wildcard).forEach(index => {
    highlights.push(new Highlight(index, wildcard, true));
  });

  return highlights;
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
