function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var InsertLocation = {
  ADD_BEFORE: 'ADD_BEFORE',
  ADD_AFTER: 'ADD_AFTER',
  ADD_INTO: 'ADD_INTO',
  REORDER: 'REORDER'
};

var InsertLocation$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': InsertLocation
});

var ADD_AFTER = InsertLocation.ADD_AFTER,
    REORDER = InsertLocation.REORDER;

var distributePositions = function distributePositions(_ref, count) {
  var _ref$lower = _ref.lower,
      lower = _ref$lower === void 0 ? 0 : _ref$lower,
      upper = _ref.upper;
  var delta = upper ? (upper - lower) / (count + 1) : 1;
  return Array.from({
    length: count
  }).map(function (_, i) {
    return delta * (i + 1) + lower;
  });
};

function getDeprecationWarning(config) {
  if (!Object.prototype.hasOwnProperty.call(config, 'isFirstChild')) return;
  console.warn("Deprecation notice:\n    'isFirstChild' option is deprecated and no longer used!\n    Providing it does not affect this function.");
}

var getPositions = function getPositions(items, index) {
  var count = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var _ref2 = items[index - 1] || {},
      lower = _ref2.position;

  var _ref3 = items[index] || {},
      upper = _ref3.position;

  return distributePositions({
    lower: lower,
    upper: upper
  }, count);
};
/**
 * Calculates item position(s) based on the options provided.
 * @param {number} newPosition The index of the anchor item by which the new
 *     positions will be calculated. Defaults to the end of the `items` array.
 * @param {Object[]} items An array of objects in which we are determining
 *     item's new position.
 * @param {boolean} isFirstChild Deprecated: Boolean value denoting whether
 *     the item should be placed as the first child of its parent.
 * @param {"ADD_AFTER" | "ADD_BEFORE" | "REORDER" } [action=REORDER]
 *     A string value determining where the item should be placed
 *     in relation to `newPosition`.
 *     `ADD_BEFORE` returns position(s) placed before the anchor element.
 *     `ADD_AFTER` returns position(s) placed after the anchor element.
 *     `REORDER` returns calculated position(s) based on `position` property of
 *     adjacent elements.
 *     Defaults to `REORDER`.
 * @param {number} count A number of items for which position needs to be
 *     determinate.
 * @return {(number|Array)} Single position if `count` is 1 or an array containing
 *     `count` positions.
 */

function calculatePosition(_ref4) {
  var newPosition = _ref4.newPosition,
      items = _ref4.items,
      _ref4$action = _ref4.action,
      action = _ref4$action === void 0 ? REORDER : _ref4$action,
      _ref4$count = _ref4.count,
      count = _ref4$count === void 0 ? 1 : _ref4$count;
  getDeprecationWarning.apply(void 0, arguments);

  var arr = _toConsumableArray(items);

  if (action === REORDER) arr.splice(newPosition, count);
  var index = items.length;

  if (newPosition !== undefined) {
    index = action === ADD_AFTER ? newPosition + 1 : newPosition;
  }

  var positions = getPositions(arr, index, count);
  return count === 1 ? positions[0] : positions;
}

export { InsertLocation$1 as InsertLocation, calculatePosition, getPositions };
