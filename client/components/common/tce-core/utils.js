import toCase from 'to-case';

export function getComponentName(type) {
  return `te-${toCase.slug(type)}`;
}

export function processAssessmentType(type) {
  return `assessment-${toCase.slug(type)}`;
}

export function getToolbarName(type) {
  return `${toCase.slug(type)}-toolbar`;
}

export function getElementId(element) {
  return element._cid || element.id;
}

export function resolveElementPosition(context) {
  const { items, newPosition, isFirstChild, insert = false } = context;
  const next = items[newPosition + 1];
  const count = items.length;
  let position, first, prev;

  if (insert) {
    first = items[0];
    prev = items[newPosition];
  } else {
    first = items[1];
    prev = items[newPosition - 1];
  }

  if (isFirstChild) {
    position = first ? first.position * 0.5 : 1;
  } else if (newPosition + 1 === count) {
    position = prev.position + 1;
  } else {
    position = (prev.position + next.position) * 0.5;
  }

  return position;
}
