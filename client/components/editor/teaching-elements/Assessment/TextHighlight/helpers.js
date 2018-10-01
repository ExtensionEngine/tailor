export function getPlainContent(text) {
  const temp = document.createElement('div');
  temp.innerHTML = text;
  return temp.innerText;
}

export function getOccurrenceIndices(string, substring, lastIndex = 0) {
  if (!string.length) return [];

  const currentIndex = string.indexOf(substring);
  if (currentIndex === -1 || currentIndex + 1 > string.length) return [];

  const newString = string.substring(currentIndex + 1);
  const index = currentIndex + lastIndex;
  const oldIndex = index + 1;

  return [index].concat(getOccurrenceIndices(newString, substring, oldIndex));
}
