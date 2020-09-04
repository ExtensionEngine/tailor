import insertActions from './insertActions';

const { ADD_AFTER, ADD_BEFORE } = insertActions;

export default function ({ newPosition, items, isFirstChild, action = '' }) {
  let prev = items[newPosition - 1];

  if (action === ADD_BEFORE) {
    const current = items[newPosition];
    return ((prev ? prev.position : 0) + current.position) * 0.5;
  }

  const next = items[newPosition + 1];
  const isLastChild = newPosition + 1 === items.length;
  let first = items[0];

  if (action === ADD_AFTER) {
    prev = items[newPosition];
  } else {
    first = items[1];
  }

  if (isFirstChild) {
    return first ? first.position * 0.5 : 1;
  } else if (isLastChild) {
    return prev.position + 1;
  }

  return (prev.position + next.position) * 0.5;
}
