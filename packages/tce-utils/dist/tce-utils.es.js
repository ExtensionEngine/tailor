import toCase from 'to-case';
import cuid from 'cuid';
import times from 'lodash/times';
import { v1 } from 'uuid';

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

var typeInfo = {
  MC: {
    type: 'MC',
    title: 'Multiple choice',
    class: 'multiple-choice'
  },
  SC: {
    type: 'SC',
    title: 'Single choice',
    class: 'single-choice'
  },
  TR: {
    type: 'TR',
    title: 'Text response',
    class: 'text-response'
  },
  NR: {
    type: 'NR',
    title: 'Numerical response',
    class: 'numerical-response'
  },
  TF: {
    type: 'TF',
    title: 'True - false',
    class: 'true-false'
  },
  FB: {
    type: 'FB',
    title: 'Fill in the blank',
    class: 'fill-blank'
  },
  MQ: {
    type: 'MQ',
    title: 'Matching question',
    class: 'matching-question'
  },
  DD: {
    type: 'DD',
    title: 'Drag & Drop',
    class: 'drag-drop'
  }
};
var baseDefaults = {
  question: [],
  hint: ''
};
var defaults = {
  MC: function MC() {
    return Object.assign({
      type: 'MC'
    }, baseDefaults, {
      answers: ['', '', ''],
      correct: []
    });
  },
  NR: function NR() {
    return Object.assign({
      type: 'NR'
    }, baseDefaults, {
      prefixes: [''],
      suffixes: [''],
      correct: ['']
    });
  },
  SC: function SC() {
    return Object.assign({
      type: 'SC'
    }, baseDefaults, {
      answers: ['', ''],
      correct: ''
    });
  },
  TR: function TR() {
    return Object.assign({
      type: 'TR'
    }, baseDefaults, {
      correct: ''
    });
  },
  TF: function TF() {
    return Object.assign({
      type: 'TF'
    }, baseDefaults, {
      correct: null
    });
  },
  FB: function FB() {
    return Object.assign({
      type: 'FB'
    }, baseDefaults, {
      correct: []
    });
  },
  MQ: function MQ() {
    var element = Object.assign({
      type: 'MQ'
    }, baseDefaults, {
      premises: [],
      responses: [],
      correct: {},
      headings: {
        premise: 'Premise',
        response: 'Response'
      }
    });
    times(2, function () {
      var premiseKey = cuid();
      var responseKey = cuid();
      element.premises.push({
        key: premiseKey,
        value: ''
      });
      element.responses.push({
        key: responseKey,
        value: ''
      });
      element.correct[premiseKey] = responseKey;
    });
    return element;
  },
  DD: function DD() {
    var element = Object.assign({
      type: 'DD'
    }, baseDefaults, {
      groups: {},
      answers: {},
      correct: {}
    });
    times(2, function () {
      var groupKey = cuid();
      var answerKey = cuid();
      element.groups[groupKey] = '';
      element.answers[answerKey] = '';
      element.correct[groupKey] = [answerKey];
    });
    return element;
  }
};
var getErrorMessages = function getErrorMessages(errors, path) {
  return errors.filter(function (err) {
    return err.path.includes(path);
  }).map(function (err) {
    return err.message;
  });
};

var assessment = /*#__PURE__*/Object.freeze({
  __proto__: null,
  typeInfo: typeInfo,
  defaults: defaults,
  getErrorMessages: getErrorMessages
});

function uuid () {
  return v1();
}

var discussion = {
  SAVE: 'comment:save',
  REMOVE: 'comment:remove',
  SET_LAST_SEEN: 'comment:setLastSeen',
  RESOLVE: 'element:resolveComments'
};

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  Discussion: discussion
});

var publishDiffChangeTypes = {
  NEW: 'new',
  CHANGED: 'changed',
  REMOVED: 'removed'
};

function getMetaName(type) {
  return "meta-".concat(toCase.slug(type));
}
function getContainerName(type) {
  return "tcc-".concat(toCase.slug(type));
}
function getComponentName(type) {
  return "tce-".concat(toCase.slug(resolveElementType(type)));
}
function processAnswerType(type) {
  return "answer-".concat(toCase.slug(type));
}
function isQuestion(type) {
  return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
}
function resolveElementType(type) {
  return isQuestion(type) ? 'QUESTION-CONTAINER' : type;
}
function getToolbarName(type) {
  return "".concat(toCase.slug(type), "-toolbar");
}
function getElementId(element) {
  return element && (element.uid || element.id);
}

export { index as Events, InsertLocation$1 as InsertLocation, assessment, calculatePosition, getComponentName, getContainerName, getElementId, getMetaName, getPositions, getToolbarName, isQuestion, processAnswerType, publishDiffChangeTypes, resolveElementType, uuid };
