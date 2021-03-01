function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (_isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);

      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var isFunction$1 = function isFunction(arg) {
  return typeof arg === 'function';
};

var last = function last(arr) {
  return arr[arr.length - 1];
};

var noop = function noop() {};

var replyEvent = function replyEvent(id) {
  return "reply->".concat(id);
};

var requestEvent = function requestEvent(id) {
  return "request->".concat(id);
};

var Channel = /*#__PURE__*/function () {
  function Channel(bus, id) {
    var _this = this;

    _classCallCheck(this, Channel);

    _defineProperty(this, "eventName", function (event) {
      return _this._id ? [_this._id, event].join('/') : event;
    });

    _defineProperty(this, "emit", delegateBus('$emit'));

    _defineProperty(this, "on", delegateBus('$on'));

    _defineProperty(this, "once", delegateBus('$once'));

    _defineProperty(this, "off", delegateBus('$off'));

    this._bus = bus;
    this._id = id;
    this._repliers = new Map();
  }

  _createClass(Channel, [{
    key: "request",
    value: function request(id) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var onReply = isFunction$1(last(args)) ? args.pop() : noop;
      this.once(replyEvent(id), onReply);
      this.emit.apply(this, [requestEvent(id)].concat(args));
      return this;
    }
  }, {
    key: "reply",
    value: function reply(id, listener) {
      var _this2 = this;

      var callback = function callback() {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        return _this2.emit.apply(_this2, [replyEvent(id)].concat(args));
      };

      var onRequest = function onRequest() {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        return listener.apply(void 0, args.concat([callback]));
      };

      this._repliers.set(listener, onRequest);

      this.on(requestEvent(id), onRequest);
      return this;
    }
  }, {
    key: "replyOnce",
    value: function replyOnce(id, listener) {
      var _this3 = this;

      var callback = function callback() {
        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        return _this3.emit.apply(_this3, [replyEvent(id)].concat(args));
      };

      var onRequest = function onRequest() {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }

        return listener.apply(void 0, args.concat([callback]));
      };

      this._repliers.set(listener, onRequest);

      this.once(requestEvent(id), onRequest);
      return this;
    }
  }, {
    key: "stopReplying",
    value: function stopReplying(id, listener) {
      var onRequest = this._repliers.get(listener);

      if (onRequest) this._repliers.delete(onRequest);
      this.off(requestEvent(id), onRequest);
      return this;
    }
  }]);

  return Channel;
}();

function delegateBus(method) {
  return function (event) {
    var _this$_bus;

    for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
      args[_key6 - 1] = arguments[_key6];
    }

    (_this$_bus = this._bus)[method].apply(_this$_bus, [this.eventName(event)].concat(args));

    return this;
  };
}

var Radio = /*#__PURE__*/function () {
  function Radio(bus) {
    _classCallCheck(this, Radio);

    this._bus = bus;
  }

  _createClass(Radio, [{
    key: "channel",
    value: function channel(id) {
      var channels = this.constructor._channels;
      if (channels.has(id)) return channels.get(id);
      var channel = new Channel(this._bus, id);
      channels.set(id, channel);
      return channel;
    }
  }], [{
    key: "getInstance",
    value: function getInstance(vm) {
      this._instance = this._instance = new Radio(vm.$root);
      return this._instance;
    }
  }]);

  return Radio;
}();

_defineProperty(Radio, "_instance", null);

_defineProperty(Radio, "_channels", new Map());

var isFunction = function isFunction(arg) {
  return typeof arg === 'function';
};

function mapChannels(channels) {
  return mapKeys(castObject(channels), function (name) {
    return function (vm) {
      return vm.$radio.channel(name);
    };
  });
}
function mapRequests(channel, requests) {
  var getChannel = !isFunction(channel) ? function (vm) {
    return vm.$radio.channel(channel);
  } : channel;
  return mapKeys(castObject(requests), function (request) {
    return function () {
      var _getChannel;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return (_getChannel = getChannel(this)).request.apply(_getChannel, [request].concat(args));
    };
  });
}

function castObject(arg) {
  if (!Array.isArray(arg)) return arg;
  return arg.reduce(function (acc, name) {
    return Object.assign(acc, _defineProperty({}, name, name));
  }, {});
}

function mapKeys(obj, cb) {
  return Object.entries(obj).reduce(function (acc, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];

    value = cb(value, key);
    return Object.assign(acc, _defineProperty({}, key, value));
  }, {});
}

var install = function install(Vue) {
  Object.defineProperty(Vue.prototype, '$radio', {
    get: function get() {
      var _this = this;

      var radio = Radio.getInstance(this);
      return {
        channel: function channel(id) {
          return wrapChannel(radio.channel(id), _this);
        },
        emit: delegateChannel('emit'),
        on: delegateChannel('on'),
        once: delegateChannel('once'),
        off: delegateChannel('off'),
        request: delegateChannel('request'),
        reply: delegateChannel('reply'),
        replyOnce: delegateChannel('replyOnce'),
        stopReplying: delegateChannel('stopReplying')
      };

      function delegateChannel(method) {
        var _this2 = this;

        return function (channelId) {
          var channel = _this2.channel(channelId);

          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          channel[method].apply(channel, args);
          return _this2;
        };
      }
    }
  });
};

function wrapChannel(channel, vm) {
  var _temp;

  var cleanup = new (_temp = /*#__PURE__*/function (_Map) {
    _inherits(_temp, _Map);

    var _super = _createSuper(_temp);

    function _temp(vm) {
      var _this3;

      _classCallCheck(this, _temp);

      _this3 = _super.call(this);

      _defineProperty(_assertThisInitialized(_this3), "run", function () {
        return _this3.forEach(function (disposeFn) {
          return disposeFn();
        });
      });

      _this3._vm = vm;
      return _this3;
    }

    _createClass(_temp, [{
      key: "set",
      value: function set(listener, disposeFn) {
        if (!this.size) this._vm.$once('hook:beforeDestroy', this.run);

        _get(_getPrototypeOf(_temp.prototype), "set", this).call(this, listener, disposeFn);

        return this;
      }
    }, {
      key: "delete",
      value: function _delete(listener) {
        _get(_getPrototypeOf(_temp.prototype), "delete", this).call(this, listener);

        if (!this.size) this._vm.$off('hook:beforeDestroy', this.run);
        return this;
      }
    }]);

    return _temp;
  }( /*#__PURE__*/_wrapNativeSuper(Map)), _temp)(vm);
  return {
    // Proxy method invocations.
    emit: channel.emit.bind(channel),
    request: channel.request.bind(channel),
    // Autoclean listener registrations.
    on: function on(event, listener) {
      cleanup.set(listener, function () {
        return channel.off(event, listener);
      });
      return channel.on(event, listener);
    },
    once: function once(event, listener) {
      cleanup.set(listener, function () {
        return channel.off(event, listener);
      });
      return channel.once(event, listener);
    },
    reply: function reply(id, listener) {
      cleanup.set(listener, function () {
        return channel.stopReplying(id, listener);
      });
      return channel.reply(id, listener);
    },
    replyOnce: function replyOnce(id, listener) {
      cleanup.set(listener, function () {
        return channel.stopReplying(id, listener);
      });
      return channel.replyOnce(id, listener);
    },
    off: function off(event, listener) {
      cleanup.delete(listener);
      return channel.off(event, listener);
    },
    stopReplying: function stopReplying(id, listener) {
      cleanup.delete(listener);
      return channel.stopReplying(id, listener);
    }
  };
}

export default install;
export { install, mapChannels, mapRequests };
