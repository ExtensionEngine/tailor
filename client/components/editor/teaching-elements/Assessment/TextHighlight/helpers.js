import Highlight from './Highlight';
import Highlights from './Highlights';

export function getPlainContent(text) {
  const temp = document.createElement('div');
  const preparedText = String(text).replace(/<p><br><\/p>/gi, '\n\n');
  temp.innerHTML = preparedText;

  return temp.innerText;
}

// TODO: replace by a regex
export function getOccurrenceIndices(str, substr, lastIndex = 0) {
  if (!str.length) return [];

  const currentIndex = str.indexOf(substr);
  if (currentIndex === -1 || currentIndex + 1 > str.length) return [];

  const newString = str.substring(currentIndex + 1);
  const index = currentIndex + lastIndex;
  const oldIndex = index + 1;

  return [index].concat(getOccurrenceIndices(newString, substr, oldIndex));
}

export function isHighlightValid(highlight, text) {
  return highlight.text === text.substring(highlight.start, highlight.end + 1);
}

export function getWildcardHighlights(wildcard, text) {
  let wildcards = [];

  getOccurrenceIndices(text, wildcard).forEach(index => {
    wildcards.push(new Highlight(index, wildcard, true));
  });

  return wildcards;
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
