import insertActions from './insertActions';

const { ADD_AFTER, ADD_BEFORE } = insertActions;

/**
 * Calculates item position based on the options provided.
 * @param {number} newPosition The position of the anchor item by which the new
 * position will be calculated.
 * @param {Object[]} items An array of objects in which we are determining
 * item's new position.
 * @param {boolean} isFirstChild Boolean value denoting wether the item should
 * be placed as the first child of its parent.
 * @param {string} [action=null] A string value determining where the item should
 * be placed in relation to `newPosition`. Defaults to `null` in case of items reorder.
 * @returns {number} Calculated item position.
 */
export default function ({ newPosition, items, isFirstChild, action = null }) {
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
