(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('to-case'), require('os'), require('crypto'), require('uuid')) :
  typeof define === 'function' && define.amd ? define(['exports', 'to-case', 'os', 'crypto', 'uuid'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TceUtils = {}, global.toCase, global.os, global.crypto, global.uuid$1));
}(this, (function (exports, toCase, os, crypto, uuid$1) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var toCase__default = /*#__PURE__*/_interopDefaultLegacy(toCase);
  var os__default = /*#__PURE__*/_interopDefaultLegacy(os);
  var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);

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

  var pad = function pad(num, size) {
    var s = '000000000' + num;
    return s.substr(s.length - size);
  };

  var padding = 2,
      pid = pad(process.pid.toString(36), padding),
      hostname = os__default['default'].hostname(),
      length = hostname.length,
      hostId = pad(hostname.split('').reduce(function (prev, char) {
    return +prev + char.charCodeAt(0);
  }, +length + 36).toString(36), padding);

  var fingerprint = function fingerprint() {
    return pid + hostId;
  };

  var lim = Math.pow(2, 32) - 1;

  var getRandomValue = function random() {
    return Math.abs(crypto__default['default'].randomBytes(4).readInt32BE() / lim);
  };

  /**
   * cuid.js
   * Collision-resistant UID generator for browsers and node.
   * Sequential for fast db lookups and recency sorting.
   * Safe for element IDs and server-side lookups.
   *
   * Extracted from CLCTR
   *
   * Copyright (c) Eric Elliott 2012
   * MIT License
   */






  var c = 0,
      blockSize = 4,
      base = 36,
      discreteValues = Math.pow(base, blockSize);

  function randomBlock() {
    return pad((getRandomValue() * discreteValues << 0).toString(base), blockSize);
  }

  function safeCounter() {
    c = c < discreteValues ? c : 0;
    c++; // this is not subliminal

    return c - 1;
  }

  function cuid() {
    // Starting with a lowercase letter makes
    // it HTML element ID friendly.
    var letter = 'c',
        // hard-coded allows for sequential access
    // timestamp
    // warning: this exposes the exact date and time
    // that the uid was created.
    timestamp = new Date().getTime().toString(base),
        // Prevent same-machine collisions.
    counter = pad(safeCounter().toString(base), blockSize),
        // A few chars to generate distinct ids for different
    // clients (so different computers are far less
    // likely to generate the same id)
    print = fingerprint(),
        // Grab some more chars from Math.random()
    random = randomBlock() + randomBlock();
    return letter + timestamp + counter + print + random;
  }

  cuid.slug = function slug() {
    var date = new Date().getTime().toString(36),
        counter = safeCounter().toString(36).slice(-4),
        print = fingerprint().slice(0, 1) + fingerprint().slice(-1),
        random = randomBlock().slice(-2);
    return date.slice(-2) + counter + print + random;
  };

  cuid.isCuid = function isCuid(stringToCheck) {
    if (typeof stringToCheck !== 'string') return false;
    if (stringToCheck.startsWith('c')) return true;
    return false;
  };

  cuid.isSlug = function isSlug(stringToCheck) {
    if (typeof stringToCheck !== 'string') return false;
    var stringLength = stringToCheck.length;
    if (stringLength >= 7 && stringLength <= 10) return true;
    return false;
  };

  cuid.fingerprint = fingerprint;
  var cuid_1 = cuid;

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  var _baseTimes = baseTimes;

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  var identity_1 = identity;

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */
  function castFunction(value) {
    return typeof value == 'function' ? value : identity_1;
  }

  var _castFunction = castFunction;

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  var isObject_1 = isObject;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto$1.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag$1),
        tag = value[symToStringTag$1];

    try {
      value[symToStringTag$1] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString$1.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag$1] = tag;
      } else {
        delete value[symToStringTag$1];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike_1(value) && _baseGetTag(value) == symbolTag);
  }

  var isSymbol_1 = isSymbol;

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol_1(value)) {
      return NAN;
    }
    if (isObject_1(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject_1(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  var toNumber_1 = toNumber;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber_1(value);
    if (value === INFINITY || value === -INFINITY) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  var toFinite_1 = toFinite;

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite_1(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  var toInteger_1 = toInteger;

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used as references for the maximum length and index of an array. */
  var MAX_ARRAY_LENGTH = 4294967295;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMin = Math.min;

  /**
   * Invokes the iteratee `n` times, returning an array of the results of
   * each invocation. The iteratee is invoked with one argument; (index).
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   * @example
   *
   * _.times(3, String);
   * // => ['0', '1', '2']
   *
   *  _.times(4, _.constant(0));
   * // => [0, 0, 0, 0]
   */
  function times(n, iteratee) {
    n = toInteger_1(n);
    if (n < 1 || n > MAX_SAFE_INTEGER) {
      return [];
    }
    var index = MAX_ARRAY_LENGTH,
        length = nativeMin(n, MAX_ARRAY_LENGTH);

    iteratee = _castFunction(iteratee);
    n -= MAX_ARRAY_LENGTH;

    var result = _baseTimes(length, iteratee);
    while (++index < n) {
      iteratee(index);
    }
    return result;
  }

  var times_1 = times;

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
      times_1(2, function () {
        var premiseKey = cuid_1();
        var responseKey = cuid_1();
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
      times_1(2, function () {
        var groupKey = cuid_1();
        var answerKey = cuid_1();
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
    return uuid$1.v1();
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
    return "meta-".concat(toCase__default['default'].slug(type));
  }
  function getContainerName(type) {
    return "tcc-".concat(toCase__default['default'].slug(type));
  }
  function getComponentName(type) {
    return "tce-".concat(toCase__default['default'].slug(resolveElementType(type)));
  }
  function processAnswerType(type) {
    return "answer-".concat(toCase__default['default'].slug(type));
  }
  function isQuestion(type) {
    return ['QUESTION', 'REFLECTION', 'ASSESSMENT'].includes(type);
  }
  function resolveElementType(type) {
    return isQuestion(type) ? 'QUESTION-CONTAINER' : type;
  }
  function getToolbarName(type) {
    return "".concat(toCase__default['default'].slug(type), "-toolbar");
  }
  function getElementId(element) {
    return element && (element.uid || element.id);
  }

  exports.Events = index;
  exports.InsertLocation = InsertLocation$1;
  exports.assessment = assessment;
  exports.calculatePosition = calculatePosition;
  exports.getComponentName = getComponentName;
  exports.getContainerName = getContainerName;
  exports.getElementId = getElementId;
  exports.getMetaName = getMetaName;
  exports.getPositions = getPositions;
  exports.getToolbarName = getToolbarName;
  exports.isQuestion = isQuestion;
  exports.processAnswerType = processAnswerType;
  exports.publishDiffChangeTypes = publishDiffChangeTypes;
  exports.resolveElementType = resolveElementType;
  exports.uuid = uuid;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
