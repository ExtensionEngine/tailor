import InsertLocation from './InsertLocation';

const { ADD_AFTER, REORDER } = InsertLocation;

const distributePositions = ({ lower = 0, upper }, count) => {
  const delta = upper ? (upper - lower) / (count + 1) : 1;
  return Array.from({ length: count }).map((_, i) => delta * (i + 1) + lower);
};

function getDeprecationWarning(config) {
  if (!Object.prototype.hasOwnProperty.call(config, 'isFirstChild')) return;
  console.warn(`Deprecation notice:
    'isFirstChild' option is deprecated and no longer used!
    Providing it does not affect this function.`);
}

export const getPositions = (items, index, count = 1) => {
  const { position: lower } = items[index - 1] || {};
  const { position: upper } = items[index] || {};
  return distributePositions({ lower, upper }, count);
};

/**
 * Calculates item position(s) based on the options provided.
 * @param {number} newPosition The index of the anchor item by which the new
 *     positions will be calculated.
 * @param {Object[]} items An array of objects in which we are determining
 *     item's new position.
 * @param {boolean} isFirstChild Deprecated: Boolean value denoting whether
 *     the item should be placed as the first child of its parent.
 * @param {string} [action=REORDER] A string value determining where the item
 *     should be placed in relation to `newPosition`. Defaults to `REORDER` in
 *     case of items reorder.
 * @param {number} count A number of positions to return.
 * @return {(number|Array)} Single position if `count` is 1 or an array containing
 * `count` positions.
 */
export default function ({ newPosition, items, action = REORDER, count = 1 }) {
  getDeprecationWarning(...arguments);
  const arr = [...items];
  if (action === REORDER) arr.splice(newPosition, count);
  const index = action === ADD_AFTER ? newPosition + 1 : newPosition;
  const positions = getPositions(arr, index, count);
  return count === 1 ? positions[0] : positions;
}
