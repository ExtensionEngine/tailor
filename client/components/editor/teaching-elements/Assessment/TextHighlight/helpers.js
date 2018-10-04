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
