import InsertLocation from './InsertLocation';
import last from 'lodash/last';

const { ADD_AFTER, ADD_BEFORE, ADD_INTO, REORDER } = InsertLocation;

/**
 * Calculates item position based on the options provided.
 * @param {number} newPosition The position of the anchor item by which the new
 *     position will be calculated.
 * @param {Object[]} items An array of objects in which we are determining
 *     item's new position.
 * @param {boolean} isFirstChild Boolean value denoting whether the item should
 *     be placed as the first child of its parent.
 * @param {string} [action=REORDER] A string value determining where the item
 *     should be placed in relation to `newPosition`. Defaults to `REORDER` in
 *     case of items reorder.
 * @return {number} Calculated item position.
 */
export default function ({ newPosition, items, isFirstChild, action = REORDER }) {
  let prev = items[newPosition - 1];

  if (action === ADD_BEFORE) {
    const current = items[newPosition];
    return ((prev ? prev.position : 0) + current.position) * 0.5;
  } else if (action === ADD_INTO) {
    const lastItem = last(items);
    return lastItem ? lastItem.position + 1 : 1;
  }

  const next = items[newPosition + 1];
  const isLastChild = newPosition + 1 === items.length;
  let first = items[0];

  if (action === ADD_AFTER) {
    prev = items[newPosition];
  } else if (action === REORDER) {
    first = items[1];
  }

  if (isFirstChild) {
    return first ? first.position * 0.5 : 1;
  } else if (isLastChild) {
    return prev.position + 1;
  }

  return (prev.position + next.position) * 0.5;
}
