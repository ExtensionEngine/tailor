import toCase from 'to-case';

const TOOLBAR_MAP = {
  'TABLE-CELL': 'HTML'
};

export function getComponentName(type) {
  const elementType = TOOLBAR_MAP[type] || type;
  return `tce-${toCase.slug(resolveElementType(elementType))}`;
}

export function processAnswerType(type) {
  return `answer-${toCase.slug(type)}`;
}

export function isQuestion(type) {
  return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
}

export function resolveElementType(type) {
  return isQuestion(type) ? 'QUESTION-CONTAINER' : type;
}

export function getToolbarName(type) {
  const elementType = TOOLBAR_MAP[type] || type;
  return `${toCase.slug(elementType)}-toolbar`;
}

export function getElementId(element) {
  return element && (element._cid || element.id);
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
