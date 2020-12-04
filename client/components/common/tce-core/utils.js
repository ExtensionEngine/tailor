import toCase from 'to-case';

export function getMetaName(type) {
  return `meta-${toCase.slug(type)}`;
}

export function getContainerName(type) {
  return `tcc-${toCase.slug(type)}`;
}

export function getComponentName(type) {
  return `tce-${toCase.slug(resolveElementType(type))}`;
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
  return `${toCase.slug(type)}-toolbar`;
}

export function getElementId(element) {
  return element && (element.uid || element.id);
}

export const getCommentEvents = () => ({
  SAVE: 'comment:save',
  REMOVE: 'comment:remove',
  SET_LAST_SEEN: 'comment:set-last-seen'
});

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
