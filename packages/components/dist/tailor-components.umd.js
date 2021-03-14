(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/capitalize'), require('@tailor/utils'), require('lodash/filter'), require('lodash/flatMap'), require('lodash/intersection'), require('lodash/pick'), require('lodash/reduce'), require('lodash/reject'), require('@tailor/api'), require('lodash/get'), require('lodash/keyBy'), require('lodash/map'), require('lodash/groupBy'), require('pluralize'), require('lodash/debounce'), require('lodash/find'), require('lodash/sortBy'), require('lodash/partition'), require('lodash/takeRight'), require('@extensionengine/vue-radio'), require('lodash/orderBy'), require('lodash/throttle'), require('vuedraggable'), require('lodash/cloneDeep'), require('lodash/mapKeys'), require('lodash/values')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/capitalize', '@tailor/utils', 'lodash/filter', 'lodash/flatMap', 'lodash/intersection', 'lodash/pick', 'lodash/reduce', 'lodash/reject', '@tailor/api', 'lodash/get', 'lodash/keyBy', 'lodash/map', 'lodash/groupBy', 'pluralize', 'lodash/debounce', 'lodash/find', 'lodash/sortBy', 'lodash/partition', 'lodash/takeRight', '@extensionengine/vue-radio', 'lodash/orderBy', 'lodash/throttle', 'vuedraggable', 'lodash/cloneDeep', 'lodash/mapKeys', 'lodash/values'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TailorComponents = {}, global.capitalize, global.utils, global.filter, global.flatMap, global.intersection, global.pick, global.reduce, global.reject, global.api, global.get, global.keyBy, global.map, global.groupBy, global.pluralize, global.debounce, global.find, global.sortBy, global.partition, global.takeRgt, global.vueRadio, global.orderBy, global.throttle, global.Draggable, global.cloneDeep, global.mapKeys, global.values));
}(this, (function (exports, capitalize, utils, filter, flatMap, intersection, pick, reduce, reject, api, get, keyBy, map, groupBy, pluralize, debounce, find, sortBy, partition, takeRgt, vueRadio, orderBy, throttle, Draggable, cloneDeep, mapKeys, values) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var capitalize__default = /*#__PURE__*/_interopDefaultLegacy(capitalize);
  var filter__default = /*#__PURE__*/_interopDefaultLegacy(filter);
  var flatMap__default = /*#__PURE__*/_interopDefaultLegacy(flatMap);
  var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
  var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
  var reduce__default = /*#__PURE__*/_interopDefaultLegacy(reduce);
  var reject__default = /*#__PURE__*/_interopDefaultLegacy(reject);
  var get__default = /*#__PURE__*/_interopDefaultLegacy(get);
  var keyBy__default = /*#__PURE__*/_interopDefaultLegacy(keyBy);
  var map__default = /*#__PURE__*/_interopDefaultLegacy(map);
  var groupBy__default = /*#__PURE__*/_interopDefaultLegacy(groupBy);
  var pluralize__default = /*#__PURE__*/_interopDefaultLegacy(pluralize);
  var debounce__default = /*#__PURE__*/_interopDefaultLegacy(debounce);
  var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
  var sortBy__default = /*#__PURE__*/_interopDefaultLegacy(sortBy);
  var partition__default = /*#__PURE__*/_interopDefaultLegacy(partition);
  var takeRgt__default = /*#__PURE__*/_interopDefaultLegacy(takeRgt);
  var orderBy__default = /*#__PURE__*/_interopDefaultLegacy(orderBy);
  var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
  var Draggable__default = /*#__PURE__*/_interopDefaultLegacy(Draggable);
  var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
  var mapKeys__default = /*#__PURE__*/_interopDefaultLegacy(mapKeys);
  var values__default = /*#__PURE__*/_interopDefaultLegacy(values);

  //
  var script$u = {
    name: 'tailor-active-users',
    props: {
      users: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      size: {
        type: Number,
        default: 36
      }
    },
    filters: {
      capitalize: capitalize__default['default']
    }
  };

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$m = ".avatar[data-v-33d463d4]{transition:all .2s}.avatar img[data-v-33d463d4]{padding:.125rem}.avatar[data-v-33d463d4]:focus-within,.avatar[data-v-33d463d4]:hover{transform:scale(1.1);z-index:1}.avatar:focus-within img[data-v-33d463d4]:focus,.avatar:hover img[data-v-33d463d4]:focus{outline:0}";
  styleInject(css_248z$m);

  /* script */
  var __vue_script__$u = script$u;
  /* template */

  var __vue_render__$u = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "d-flex align-center"
    }, _vm._l(_vm.users, function (ref) {
      var id = ref.id;
      var label = ref.label;
      var imgUrl = ref.imgUrl;
      return _c('v-avatar', {
        key: id,
        staticClass: "avatar",
        attrs: {
          "size": _vm.size,
          "color": "pink accent-2"
        }
      }, [_c('v-tooltip', {
        attrs: {
          "bottom": ""
        },
        scopedSlots: _vm._u([{
          key: "activator",
          fn: function fn(ref) {
            var on = ref.on;
            return [imgUrl ? _c('img', _vm._g({
              attrs: {
                "src": imgUrl,
                "alt": label,
                "aria-describedby": "activeUser-" + id,
                "tabindex": "0"
              }
            }, on)) : _vm._e()];
          }
        }], null, true)
      }, [_vm._v(" "), _c('span', {
        attrs: {
          "id": "activeUser-" + id
        }
      }, [_vm._v(_vm._s(label))])])], 1);
    }), 1);
  };

  var __vue_staticRenderFns__$u = [];
  /* style */

  var __vue_inject_styles__$u = undefined;
  /* scoped */

  var __vue_scope_id__$u = "data-v-33d463d4";
  /* functional template */

  var __vue_is_functional_template__$u = false;
  /* component normalizer */

  function __vue_normalize__$u(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ActiveUsers.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ActiveUsers$1 = __vue_normalize__$u({
    render: __vue_render__$u,
    staticRenderFns: __vue_staticRenderFns__$u
  }, __vue_inject_styles__$u, __vue_script__$u, __vue_scope_id__$u, __vue_is_functional_template__$u);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$t = {
    name: 'add-new-element',
    props: {
      library: {
        type: Array,
        required: true
      },
      allowedTypes: {
        type: Array,
        required: true
      }
    },
    methods: {
      isAllowed: function isAllowed(type) {
        return !this.allowedTypes.length || this.allowedTypes.includes(type);
      }
    }
  };

  var css_248z$l = ".element-container[data-v-5e4d908e]{min-height:20rem;padding:0 0 1.875rem;border-top-left-radius:.5rem;border-top-right-radius:.5rem;overflow:hidden}.group-heading[data-v-5e4d908e]{margin:0 2.5rem .375rem;padding-top:.5rem;font-size:.875rem;font-weight:500;line-height:1rem;text-align:left}.group-elements[data-v-5e4d908e]{display:flex;flex-wrap:wrap;width:100%;padding:0 1.875rem}.add-element[data-v-5e4d908e]{width:8.125rem;min-width:8.125rem;height:auto!important;min-height:4.375rem;padding:0!important;white-space:normal}.add-element[data-v-5e4d908e]  .v-btn__content{flex:1 1 100%;flex-direction:column;padding:.375rem;text-transform:none}.add-element .v-icon[data-v-5e4d908e]{padding:.125rem 0;font-size:1.875rem}.add-element .button-text[data-v-5e4d908e]{margin:.625rem 0}";
  styleInject(css_248z$l);

  /* script */
  var __vue_script__$t = script$t;
  /* template */

  var __vue_render__$t = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-bottom-sheet', _vm._g(_vm._b({
      attrs: {
        "max-width": "1240",
        "inset": ""
      }
    }, 'v-bottom-sheet', _vm.$attrs, false), _vm.$listeners), [_c('div', {
      staticClass: "element-container grey lighten-5"
    }, [_c('div', {
      staticClass: "d-flex align-center py-4 px-10"
    }, [_vm._t("header")], 2), _vm._v(" "), _vm._l(_vm.library, function (group) {
      return _c('div', {
        key: group.name
      }, [_c('div', {
        staticClass: "group-heading grey--text text--darken-4"
      }, [_vm._v(_vm._s(group.name))]), _vm._v(" "), _c('div', {
        staticClass: "group-elements"
      }, _vm._l(group.elements, function (element) {
        return _c('v-hover', {
          key: element.position,
          scopedSlots: _vm._u([{
            key: "default",
            fn: function fn(ref) {
              var hover = ref.hover;
              return [_c('v-btn', {
                staticClass: "add-element",
                attrs: {
                  "disabled": !_vm.isAllowed(element.type),
                  "color": hover ? 'secondary accent-2' : 'blue-grey darken-4',
                  "text": ""
                },
                on: {
                  "click": function click($event) {
                    $event.stopPropagation();
                    return _vm.$emit('add', [element]);
                  }
                }
              }, [element.ui.icon ? _c('v-icon', {
                attrs: {
                  "size": "26",
                  "color": "primary darken-3"
                }
              }, [_vm._v("\n              " + _vm._s(element.ui.icon) + "\n            ")]) : _vm._e(), _vm._v(" "), _c('span', {
                staticClass: "button-text body-2"
              }, [_vm._v(_vm._s(element.name))])], 1)];
            }
          }], null, true)
        });
      }), 1)]);
    })], 2)]);
  };

  var __vue_staticRenderFns__$t = [];
  /* style */

  var __vue_inject_styles__$t = undefined;
  /* scoped */

  var __vue_scope_id__$t = "data-v-5e4d908e";
  /* functional template */

  var __vue_is_functional_template__$t = false;
  /* component normalizer */

  function __vue_normalize__$t(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "AddNewElement.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var AddNewElement$1 = __vue_normalize__$t({
    render: __vue_render__$t,
    staticRenderFns: __vue_staticRenderFns__$t
  }, __vue_inject_styles__$t, __vue_script__$t, __vue_scope_id__$t, __vue_is_functional_template__$t);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _defineProperty$1(obj, key, value) {
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

  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
  }

  function _toConsumableArray$1(arr) {
    return _arrayWithoutHoles$1(arr) || _iterableToArray$1(arr) || _unsupportedIterableToArray$1(arr) || _nonIterableSpread$1();
  }

  function _arrayWithoutHoles$1(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray$1(arr);
  }

  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray$1(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit$1(arr, i) {
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

  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }

  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var randomInteger = function randomInteger(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
  };

  var createAbortError = function createAbortError() {
    var error = new Error('Delay aborted');
    error.name = 'AbortError';
    return error;
  };

  var createDelay = function createDelay(_ref) {
    var defaultClear = _ref.clearTimeout,
        set = _ref.setTimeout,
        willResolve = _ref.willResolve;
    return function (ms) {
      var _ref2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          value = _ref2.value,
          signal = _ref2.signal;

      if (signal && signal.aborted) {
        return Promise.reject(createAbortError());
      }

      var timeoutId;
      var settle;
      var rejectFn;
      var clear = defaultClear || clearTimeout;

      var signalListener = function signalListener() {
        clear(timeoutId);
        rejectFn(createAbortError());
      };

      var cleanup = function cleanup() {
        if (signal) {
          signal.removeEventListener('abort', signalListener);
        }
      };

      var delayPromise = new Promise(function (resolve, reject) {
        settle = function settle() {
          cleanup();

          if (willResolve) {
            resolve(value);
          } else {
            reject(value);
          }
        };

        rejectFn = reject;
        timeoutId = (set || setTimeout)(settle, ms);
      });

      if (signal) {
        signal.addEventListener('abort', signalListener, {
          once: true
        });
      }

      delayPromise.clear = function () {
        clear(timeoutId);
        timeoutId = null;
        settle();
      };

      return delayPromise;
    };
  };

  var delay = createDelay({
    willResolve: true
  });
  delay.reject = createDelay({
    willResolve: false
  });

  delay.range = function (minimum, maximum, options) {
    return delay(randomInteger(minimum, maximum), options);
  };

  delay.createWithTimers = function (_ref3) {
    var clearTimeout = _ref3.clearTimeout,
        setTimeout = _ref3.setTimeout;
    var delay = createDelay({
      clearTimeout: clearTimeout,
      setTimeout: setTimeout,
      willResolve: true
    });
    delay.reject = createDelay({
      clearTimeout: clearTimeout,
      setTimeout: setTimeout,
      willResolve: false
    });
    return delay;
  };

  var delay_1 = delay; // TODO: Remove this for the next major release

  var _default$1 = delay;
  delay_1.default = _default$1;

  var pMinDelay = async function pMinDelay(promise, minimumDelay, options) {
    options = Object.assign({
      delayRejection: true
    }, options);
    var promiseError;

    if (options.delayRejection) {
      promise = promise.catch(function (error) {
        promiseError = error;
      });
    }

    var value = await Promise.all([promise, delay_1(minimumDelay)]);
    return promiseError ? Promise.reject(promiseError) : value[0];
  };

  var pMinDelay_1 = pMinDelay; // TODO: Remove this for the next major release

  var _default = pMinDelay;
  pMinDelay_1.default = _default;

  /*!
   * vuex v3.5.1
   * (c) 2020 Evan You
   * @license MIT
   */
  function applyMixin(Vue) {
    var version = Number(Vue.version.split('.')[0]);

    if (version >= 2) {
      Vue.mixin({
        beforeCreate: vuexInit
      });
    } else {
      // override init and inject vuex init procedure
      // for 1.x backwards compatibility.
      var _init = Vue.prototype._init;

      Vue.prototype._init = function (options) {
        if (options === void 0) options = {};
        options.init = options.init ? [vuexInit].concat(options.init) : vuexInit;

        _init.call(this, options);
      };
    }
    /**
     * Vuex init hook, injected into each instances init hooks list.
     */


    function vuexInit() {
      var options = this.$options; // store injection

      if (options.store) {
        this.$store = typeof options.store === 'function' ? options.store() : options.store;
      } else if (options.parent && options.parent.$store) {
        this.$store = options.parent.$store;
      }
    }
  }

  var target = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {};
  var devtoolHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  function devtoolPlugin(store) {
    if (!devtoolHook) {
      return;
    }

    store._devtoolHook = devtoolHook;
    devtoolHook.emit('vuex:init', store);
    devtoolHook.on('vuex:travel-to-state', function (targetState) {
      store.replaceState(targetState);
    });
    store.subscribe(function (mutation, state) {
      devtoolHook.emit('vuex:mutation', mutation, state);
    }, {
      prepend: true
    });
    store.subscribeAction(function (action, state) {
      devtoolHook.emit('vuex:action', action, state);
    }, {
      prepend: true
    });
  }
  /**
   * forEach for object
   */


  function forEachValue(obj, fn) {
    Object.keys(obj).forEach(function (key) {
      return fn(obj[key], key);
    });
  }

  function isObject(obj) {
    return obj !== null && _typeof(obj) === 'object';
  }

  function isPromise(val) {
    return val && typeof val.then === 'function';
  }

  function assert(condition, msg) {
    if (!condition) {
      throw new Error("[vuex] " + msg);
    }
  }

  function partial(fn, arg) {
    return function () {
      return fn(arg);
    };
  } // Base data struct for store's module, package with some attribute and method


  var Module = function Module(rawModule, runtime) {
    this.runtime = runtime; // Store some children item

    this._children = Object.create(null); // Store the origin module object which passed by programmer

    this._rawModule = rawModule;
    var rawState = rawModule.state; // Store the origin module's state

    this.state = (typeof rawState === 'function' ? rawState() : rawState) || {};
  };

  var prototypeAccessors = {
    namespaced: {
      configurable: true
    }
  };

  prototypeAccessors.namespaced.get = function () {
    return !!this._rawModule.namespaced;
  };

  Module.prototype.addChild = function addChild(key, module) {
    this._children[key] = module;
  };

  Module.prototype.removeChild = function removeChild(key) {
    delete this._children[key];
  };

  Module.prototype.getChild = function getChild(key) {
    return this._children[key];
  };

  Module.prototype.hasChild = function hasChild(key) {
    return key in this._children;
  };

  Module.prototype.update = function update(rawModule) {
    this._rawModule.namespaced = rawModule.namespaced;

    if (rawModule.actions) {
      this._rawModule.actions = rawModule.actions;
    }

    if (rawModule.mutations) {
      this._rawModule.mutations = rawModule.mutations;
    }

    if (rawModule.getters) {
      this._rawModule.getters = rawModule.getters;
    }
  };

  Module.prototype.forEachChild = function forEachChild(fn) {
    forEachValue(this._children, fn);
  };

  Module.prototype.forEachGetter = function forEachGetter(fn) {
    if (this._rawModule.getters) {
      forEachValue(this._rawModule.getters, fn);
    }
  };

  Module.prototype.forEachAction = function forEachAction(fn) {
    if (this._rawModule.actions) {
      forEachValue(this._rawModule.actions, fn);
    }
  };

  Module.prototype.forEachMutation = function forEachMutation(fn) {
    if (this._rawModule.mutations) {
      forEachValue(this._rawModule.mutations, fn);
    }
  };

  Object.defineProperties(Module.prototype, prototypeAccessors);

  var ModuleCollection = function ModuleCollection(rawRootModule) {
    // register root module (Vuex.Store options)
    this.register([], rawRootModule, false);
  };

  ModuleCollection.prototype.get = function get(path) {
    return path.reduce(function (module, key) {
      return module.getChild(key);
    }, this.root);
  };

  ModuleCollection.prototype.getNamespace = function getNamespace(path) {
    var module = this.root;
    return path.reduce(function (namespace, key) {
      module = module.getChild(key);
      return namespace + (module.namespaced ? key + '/' : '');
    }, '');
  };

  ModuleCollection.prototype.update = function update$1(rawRootModule) {
    update([], this.root, rawRootModule);
  };

  ModuleCollection.prototype.register = function register(path, rawModule, runtime) {
    var this$1 = this;
    if (runtime === void 0) runtime = true;

    {
      assertRawModule(path, rawModule);
    }

    var newModule = new Module(rawModule, runtime);

    if (path.length === 0) {
      this.root = newModule;
    } else {
      var parent = this.get(path.slice(0, -1));
      parent.addChild(path[path.length - 1], newModule);
    } // register nested modules


    if (rawModule.modules) {
      forEachValue(rawModule.modules, function (rawChildModule, key) {
        this$1.register(path.concat(key), rawChildModule, runtime);
      });
    }
  };

  ModuleCollection.prototype.unregister = function unregister(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    var child = parent.getChild(key);

    if (!child) {
      {
        console.warn("[vuex] trying to unregister module '" + key + "', which is " + "not registered");
      }

      return;
    }

    if (!child.runtime) {
      return;
    }

    parent.removeChild(key);
  };

  ModuleCollection.prototype.isRegistered = function isRegistered(path) {
    var parent = this.get(path.slice(0, -1));
    var key = path[path.length - 1];
    return parent.hasChild(key);
  };

  function update(path, targetModule, newModule) {
    {
      assertRawModule(path, newModule);
    } // update target module


    targetModule.update(newModule); // update nested modules

    if (newModule.modules) {
      for (var key in newModule.modules) {
        if (!targetModule.getChild(key)) {
          {
            console.warn("[vuex] trying to add a new module '" + key + "' on hot reloading, " + 'manual reload is needed');
          }

          return;
        }

        update(path.concat(key), targetModule.getChild(key), newModule.modules[key]);
      }
    }
  }

  var functionAssert = {
    assert: function assert(value) {
      return typeof value === 'function';
    },
    expected: 'function'
  };
  var objectAssert = {
    assert: function assert(value) {
      return typeof value === 'function' || _typeof(value) === 'object' && typeof value.handler === 'function';
    },
    expected: 'function or object with "handler" function'
  };
  var assertTypes = {
    getters: functionAssert,
    mutations: functionAssert,
    actions: objectAssert
  };

  function assertRawModule(path, rawModule) {
    Object.keys(assertTypes).forEach(function (key) {
      if (!rawModule[key]) {
        return;
      }

      var assertOptions = assertTypes[key];
      forEachValue(rawModule[key], function (value, type) {
        assert(assertOptions.assert(value), makeAssertionMessage(path, key, type, value, assertOptions.expected));
      });
    });
  }

  function makeAssertionMessage(path, key, type, value, expected) {
    var buf = key + " should be " + expected + " but \"" + key + "." + type + "\"";

    if (path.length > 0) {
      buf += " in module \"" + path.join('.') + "\"";
    }

    buf += " is " + JSON.stringify(value) + ".";
    return buf;
  }

  var Vue; // bind on install

  var Store = function Store(options) {
    var this$1 = this;
    if (options === void 0) options = {}; // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #731

    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }

    {
      assert(Vue, "must call Vue.use(Vuex) before creating a store instance.");
      assert(typeof Promise !== 'undefined', "vuex requires a Promise polyfill in this browser.");
      assert(this instanceof Store, "store must be called with the new operator.");
    }

    var plugins = options.plugins;
    if (plugins === void 0) plugins = [];
    var strict = options.strict;
    if (strict === void 0) strict = false; // store internal state

    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._watcherVM = new Vue();
    this._makeLocalGettersCache = Object.create(null); // bind commit and dispatch to self

    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;

    this.dispatch = function boundDispatch(type, payload) {
      return dispatch.call(store, type, payload);
    };

    this.commit = function boundCommit(type, payload, options) {
      return commit.call(store, type, payload, options);
    }; // strict mode


    this.strict = strict;
    var state = this._modules.root.state; // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters

    installModule(this, state, [], this._modules.root); // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)

    resetStoreVM(this, state); // apply plugins

    plugins.forEach(function (plugin) {
      return plugin(this$1);
    });
    var useDevtools = options.devtools !== undefined ? options.devtools : Vue.config.devtools;

    if (useDevtools) {
      devtoolPlugin(this);
    }
  };

  var prototypeAccessors$1 = {
    state: {
      configurable: true
    }
  };

  prototypeAccessors$1.state.get = function () {
    return this._vm._data.$$state;
  };

  prototypeAccessors$1.state.set = function (v) {
    {
      assert(false, "use store.replaceState() to explicit replace store state.");
    }
  };

  Store.prototype.commit = function commit(_type, _payload, _options) {
    var this$1 = this; // check object-style commit

    var ref = unifyObjectStyle(_type, _payload, _options);
    var type = ref.type;
    var payload = ref.payload;
    var options = ref.options;
    var mutation = {
      type: type,
      payload: payload
    };
    var entry = this._mutations[type];

    if (!entry) {
      {
        console.error("[vuex] unknown mutation type: " + type);
      }

      return;
    }

    this._withCommit(function () {
      entry.forEach(function commitIterator(handler) {
        handler(payload);
      });
    });

    this._subscribers.slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
    .forEach(function (sub) {
      return sub(mutation, this$1.state);
    });

    if (options && options.silent) {
      console.warn("[vuex] mutation type: " + type + ". Silent option has been removed. " + 'Use the filter functionality in the vue-devtools');
    }
  };

  Store.prototype.dispatch = function dispatch(_type, _payload) {
    var this$1 = this; // check object-style dispatch

    var ref = unifyObjectStyle(_type, _payload);
    var type = ref.type;
    var payload = ref.payload;
    var action = {
      type: type,
      payload: payload
    };
    var entry = this._actions[type];

    if (!entry) {
      {
        console.error("[vuex] unknown action type: " + type);
      }

      return;
    }

    try {
      this._actionSubscribers.slice() // shallow copy to prevent iterator invalidation if subscriber synchronously calls unsubscribe
      .filter(function (sub) {
        return sub.before;
      }).forEach(function (sub) {
        return sub.before(action, this$1.state);
      });
    } catch (e) {
      {
        console.warn("[vuex] error in before action subscribers: ");
        console.error(e);
      }
    }

    var result = entry.length > 1 ? Promise.all(entry.map(function (handler) {
      return handler(payload);
    })) : entry[0](payload);
    return new Promise(function (resolve, reject) {
      result.then(function (res) {
        try {
          this$1._actionSubscribers.filter(function (sub) {
            return sub.after;
          }).forEach(function (sub) {
            return sub.after(action, this$1.state);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in after action subscribers: ");
            console.error(e);
          }
        }

        resolve(res);
      }, function (error) {
        try {
          this$1._actionSubscribers.filter(function (sub) {
            return sub.error;
          }).forEach(function (sub) {
            return sub.error(action, this$1.state, error);
          });
        } catch (e) {
          {
            console.warn("[vuex] error in error action subscribers: ");
            console.error(e);
          }
        }

        reject(error);
      });
    });
  };

  Store.prototype.subscribe = function subscribe(fn, options) {
    return genericSubscribe(fn, this._subscribers, options);
  };

  Store.prototype.subscribeAction = function subscribeAction(fn, options) {
    var subs = typeof fn === 'function' ? {
      before: fn
    } : fn;
    return genericSubscribe(subs, this._actionSubscribers, options);
  };

  Store.prototype.watch = function watch(getter, cb, options) {
    var this$1 = this;

    {
      assert(typeof getter === 'function', "store.watch only accepts a function.");
    }

    return this._watcherVM.$watch(function () {
      return getter(this$1.state, this$1.getters);
    }, cb, options);
  };

  Store.prototype.replaceState = function replaceState(state) {
    var this$1 = this;

    this._withCommit(function () {
      this$1._vm._data.$$state = state;
    });
  };

  Store.prototype.registerModule = function registerModule(path, rawModule, options) {
    if (options === void 0) options = {};

    if (typeof path === 'string') {
      path = [path];
    }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
      assert(path.length > 0, 'cannot register the root module by using registerModule.');
    }

    this._modules.register(path, rawModule);

    installModule(this, this.state, path, this._modules.get(path), options.preserveState); // reset store to update getters...

    resetStoreVM(this, this.state);
  };

  Store.prototype.unregisterModule = function unregisterModule(path) {
    var this$1 = this;

    if (typeof path === 'string') {
      path = [path];
    }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }

    this._modules.unregister(path);

    this._withCommit(function () {
      var parentState = getNestedState(this$1.state, path.slice(0, -1));
      Vue.delete(parentState, path[path.length - 1]);
    });

    resetStore(this);
  };

  Store.prototype.hasModule = function hasModule(path) {
    if (typeof path === 'string') {
      path = [path];
    }

    {
      assert(Array.isArray(path), "module path must be a string or an Array.");
    }

    return this._modules.isRegistered(path);
  };

  Store.prototype.hotUpdate = function hotUpdate(newOptions) {
    this._modules.update(newOptions);

    resetStore(this, true);
  };

  Store.prototype._withCommit = function _withCommit(fn) {
    var committing = this._committing;
    this._committing = true;
    fn();
    this._committing = committing;
  };

  Object.defineProperties(Store.prototype, prototypeAccessors$1);

  function genericSubscribe(fn, subs, options) {
    if (subs.indexOf(fn) < 0) {
      options && options.prepend ? subs.unshift(fn) : subs.push(fn);
    }

    return function () {
      var i = subs.indexOf(fn);

      if (i > -1) {
        subs.splice(i, 1);
      }
    };
  }

  function resetStore(store, hot) {
    store._actions = Object.create(null);
    store._mutations = Object.create(null);
    store._wrappedGetters = Object.create(null);
    store._modulesNamespaceMap = Object.create(null);
    var state = store.state; // init all modules

    installModule(store, state, [], store._modules.root, true); // reset vm

    resetStoreVM(store, state, hot);
  }

  function resetStoreVM(store, state, hot) {
    var oldVm = store._vm; // bind store public getters

    store.getters = {}; // reset local getters cache

    store._makeLocalGettersCache = Object.create(null);
    var wrappedGetters = store._wrappedGetters;
    var computed = {};
    forEachValue(wrappedGetters, function (fn, key) {
      // use computed to leverage its lazy-caching mechanism
      // direct inline function use will lead to closure preserving oldVm.
      // using partial to return function with only arguments preserved in closure environment.
      computed[key] = partial(fn, store);
      Object.defineProperty(store.getters, key, {
        get: function get() {
          return store._vm[key];
        },
        enumerable: true // for local getters

      });
    }); // use a Vue instance to store the state tree
    // suppress warnings just in case the user has added
    // some funky global mixins

    var silent = Vue.config.silent;
    Vue.config.silent = true;
    store._vm = new Vue({
      data: {
        $$state: state
      },
      computed: computed
    });
    Vue.config.silent = silent; // enable strict mode for new vm

    if (store.strict) {
      enableStrictMode(store);
    }

    if (oldVm) {
      if (hot) {
        // dispatch changes in all subscribed watchers
        // to force getter re-evaluation for hot reloading.
        store._withCommit(function () {
          oldVm._data.$$state = null;
        });
      }

      Vue.nextTick(function () {
        return oldVm.$destroy();
      });
    }
  }

  function installModule(store, rootState, path, module, hot) {
    var isRoot = !path.length;

    var namespace = store._modules.getNamespace(path); // register in namespace map


    if (module.namespaced) {
      if (store._modulesNamespaceMap[namespace] && "development" !== 'production') {
        console.error("[vuex] duplicate namespace " + namespace + " for the namespaced module " + path.join('/'));
      }

      store._modulesNamespaceMap[namespace] = module;
    } // set state


    if (!isRoot && !hot) {
      var parentState = getNestedState(rootState, path.slice(0, -1));
      var moduleName = path[path.length - 1];

      store._withCommit(function () {
        {
          if (moduleName in parentState) {
            console.warn("[vuex] state field \"" + moduleName + "\" was overridden by a module with the same name at \"" + path.join('.') + "\"");
          }
        }

        Vue.set(parentState, moduleName, module.state);
      });
    }

    var local = module.context = makeLocalContext(store, namespace, path);
    module.forEachMutation(function (mutation, key) {
      var namespacedType = namespace + key;
      registerMutation(store, namespacedType, mutation, local);
    });
    module.forEachAction(function (action, key) {
      var type = action.root ? key : namespace + key;
      var handler = action.handler || action;
      registerAction(store, type, handler, local);
    });
    module.forEachGetter(function (getter, key) {
      var namespacedType = namespace + key;
      registerGetter(store, namespacedType, getter, local);
    });
    module.forEachChild(function (child, key) {
      installModule(store, rootState, path.concat(key), child, hot);
    });
  }
  /**
   * make localized dispatch, commit, getters and state
   * if there is no namespace, just use root ones
   */


  function makeLocalContext(store, namespace, path) {
    var noNamespace = namespace === '';
    var local = {
      dispatch: noNamespace ? store.dispatch : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;

          if (!store._actions[type]) {
            console.error("[vuex] unknown local action type: " + args.type + ", global type: " + type);
            return;
          }
        }

        return store.dispatch(type, payload);
      },
      commit: noNamespace ? store.commit : function (_type, _payload, _options) {
        var args = unifyObjectStyle(_type, _payload, _options);
        var payload = args.payload;
        var options = args.options;
        var type = args.type;

        if (!options || !options.root) {
          type = namespace + type;

          if (!store._mutations[type]) {
            console.error("[vuex] unknown local mutation type: " + args.type + ", global type: " + type);
            return;
          }
        }

        store.commit(type, payload, options);
      }
    }; // getters and state object must be gotten lazily
    // because they will be changed by vm update

    Object.defineProperties(local, {
      getters: {
        get: noNamespace ? function () {
          return store.getters;
        } : function () {
          return makeLocalGetters(store, namespace);
        }
      },
      state: {
        get: function get() {
          return getNestedState(store.state, path);
        }
      }
    });
    return local;
  }

  function makeLocalGetters(store, namespace) {
    if (!store._makeLocalGettersCache[namespace]) {
      var gettersProxy = {};
      var splitPos = namespace.length;
      Object.keys(store.getters).forEach(function (type) {
        // skip if the target getter is not match this namespace
        if (type.slice(0, splitPos) !== namespace) {
          return;
        } // extract local getter type


        var localType = type.slice(splitPos); // Add a port to the getters proxy.
        // Define as getter property because
        // we do not want to evaluate the getters in this time.

        Object.defineProperty(gettersProxy, localType, {
          get: function get() {
            return store.getters[type];
          },
          enumerable: true
        });
      });
      store._makeLocalGettersCache[namespace] = gettersProxy;
    }

    return store._makeLocalGettersCache[namespace];
  }

  function registerMutation(store, type, handler, local) {
    var entry = store._mutations[type] || (store._mutations[type] = []);
    entry.push(function wrappedMutationHandler(payload) {
      handler.call(store, local.state, payload);
    });
  }

  function registerAction(store, type, handler, local) {
    var entry = store._actions[type] || (store._actions[type] = []);
    entry.push(function wrappedActionHandler(payload) {
      var res = handler.call(store, {
        dispatch: local.dispatch,
        commit: local.commit,
        getters: local.getters,
        state: local.state,
        rootGetters: store.getters,
        rootState: store.state
      }, payload);

      if (!isPromise(res)) {
        res = Promise.resolve(res);
      }

      if (store._devtoolHook) {
        return res.catch(function (err) {
          store._devtoolHook.emit('vuex:error', err);

          throw err;
        });
      } else {
        return res;
      }
    });
  }

  function registerGetter(store, type, rawGetter, local) {
    if (store._wrappedGetters[type]) {
      {
        console.error("[vuex] duplicate getter key: " + type);
      }

      return;
    }

    store._wrappedGetters[type] = function wrappedGetter(store) {
      return rawGetter(local.state, // local state
      local.getters, // local getters
      store.state, // root state
      store.getters // root getters
      );
    };
  }

  function enableStrictMode(store) {
    store._vm.$watch(function () {
      return this._data.$$state;
    }, function () {
      {
        assert(store._committing, "do not mutate vuex store state outside mutation handlers.");
      }
    }, {
      deep: true,
      sync: true
    });
  }

  function getNestedState(state, path) {
    return path.reduce(function (state, key) {
      return state[key];
    }, state);
  }

  function unifyObjectStyle(type, payload, options) {
    if (isObject(type) && type.type) {
      options = payload;
      payload = type;
      type = type.type;
    }

    {
      assert(typeof type === 'string', "expects string as the type, but found " + _typeof(type) + ".");
    }

    return {
      type: type,
      payload: payload,
      options: options
    };
  }

  function install(_Vue) {
    if (Vue && _Vue === Vue) {
      {
        console.error('[vuex] already installed. Vue.use(Vuex) should be called only once.');
      }

      return;
    }

    Vue = _Vue;
    applyMixin(Vue);
  }
  /**
   * Reduce the code which written in Vue.js for getting the getters
   * @param {String} [namespace] - Module's namespace
   * @param {Object|Array} getters
   * @return {Object}
   */

  var mapGetters = normalizeNamespace(function (namespace, getters) {
    var res = {};

    if (!isValidMap(getters)) {
      console.error('[vuex] mapGetters: mapper parameter must be either an Array or an Object');
    }

    normalizeMap(getters).forEach(function (ref) {
      var key = ref.key;
      var val = ref.val; // The namespace has been mutated by normalizeNamespace

      val = namespace + val;

      res[key] = function mappedGetter() {
        if (namespace && !getModuleByNamespace(this.$store, 'mapGetters', namespace)) {
          return;
        }

        if (!(val in this.$store.getters)) {
          console.error("[vuex] unknown getter: " + val);
          return;
        }

        return this.$store.getters[val];
      }; // mark vuex getter for devtools


      res[key].vuex = true;
    });
    return res;
  });
  /**
   * Normalize the map
   * normalizeMap([1, 2, 3]) => [ { key: 1, val: 1 }, { key: 2, val: 2 }, { key: 3, val: 3 } ]
   * normalizeMap({a: 1, b: 2, c: 3}) => [ { key: 'a', val: 1 }, { key: 'b', val: 2 }, { key: 'c', val: 3 } ]
   * @param {Array|Object} map
   * @return {Object}
   */


  function normalizeMap(map) {
    if (!isValidMap(map)) {
      return [];
    }

    return Array.isArray(map) ? map.map(function (key) {
      return {
        key: key,
        val: key
      };
    }) : Object.keys(map).map(function (key) {
      return {
        key: key,
        val: map[key]
      };
    });
  }
  /**
   * Validate whether given map is valid or not
   * @param {*} map
   * @return {Boolean}
   */


  function isValidMap(map) {
    return Array.isArray(map) || isObject(map);
  }
  /**
   * Return a function expect two param contains namespace and map. it will normalize the namespace and then the param's function will handle the new namespace and the map.
   * @param {Function} fn
   * @return {Function}
   */


  function normalizeNamespace(fn) {
    return function (namespace, map) {
      if (typeof namespace !== 'string') {
        map = namespace;
        namespace = '';
      } else if (namespace.charAt(namespace.length - 1) !== '/') {
        namespace += '/';
      }

      return fn(namespace, map);
    };
  }
  /**
   * Search a special module from store by namespace. if module not exist, print error message.
   * @param {Object} store
   * @param {String} helper
   * @param {String} namespace
   * @return {Object}
   */


  function getModuleByNamespace(store, helper, namespace) {
    var module = store._modulesNamespaceMap[namespace];

    if (!module) {
      console.error("[vuex] module namespace not found in " + helper + "(): " + namespace);
    }

    return module;
  } // Credits: borrowed code from fcomb/redux-logger

  var script$r = {
    name: 'tailor-active-users',
    props: {
      users: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      size: {
        type: Number,
        default: 36
      }
    },
    filters: {
      capitalize: capitalize__default['default']
    }
  };
  var css_248z$j = ".avatar[data-v-33d463d4]{transition:all .2s}.avatar img[data-v-33d463d4]{padding:.125rem}.avatar[data-v-33d463d4]:focus-within,.avatar[data-v-33d463d4]:hover{transform:scale(1.1);z-index:1}.avatar:focus-within img[data-v-33d463d4]:focus,.avatar:hover img[data-v-33d463d4]:focus{outline:0}";
  styleInject(css_248z$j);
  /* script */

  var __vue_script__$r = script$r;
  /* template */

  var __vue_render__$r = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "d-flex align-center"
    }, _vm._l(_vm.users, function (ref) {
      var id = ref.id;
      var label = ref.label;
      var imgUrl = ref.imgUrl;
      return _c('v-avatar', {
        key: id,
        staticClass: "avatar",
        attrs: {
          "size": _vm.size,
          "color": "pink accent-2"
        }
      }, [_c('v-tooltip', {
        attrs: {
          "bottom": ""
        },
        scopedSlots: _vm._u([{
          key: "activator",
          fn: function fn(ref) {
            var on = ref.on;
            return [imgUrl ? _c('img', _vm._g({
              attrs: {
                "src": imgUrl,
                "alt": label,
                "aria-describedby": "activeUser-" + id,
                "tabindex": "0"
              }
            }, on)) : _vm._e()];
          }
        }], null, true)
      }, [_vm._v(" "), _c('span', {
        attrs: {
          "id": "activeUser-" + id
        }
      }, [_vm._v(_vm._s(label))])])], 1);
    }), 1);
  };

  var __vue_staticRenderFns__$r = [];
  /* style */

  var __vue_inject_styles__$r = undefined;
  /* scoped */

  var __vue_scope_id__$r = "data-v-33d463d4";
  /* functional template */

  var __vue_is_functional_template__$r = false;
  /* component normalizer */

  function __vue_normalize__$r(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ActiveUsers.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ActiveUsers = __vue_normalize__$r({
    render: __vue_render__$r,
    staticRenderFns: __vue_staticRenderFns__$r
  }, __vue_inject_styles__$r, __vue_script__$r, __vue_scope_id__$r, __vue_is_functional_template__$r); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$q = {
    name: 'add-new-element',
    props: {
      library: {
        type: Array,
        required: true
      },
      allowedTypes: {
        type: Array,
        required: true
      }
    },
    methods: {
      isAllowed: function isAllowed(type) {
        return !this.allowedTypes.length || this.allowedTypes.includes(type);
      }
    }
  };
  var css_248z$i = ".element-container[data-v-5e4d908e]{min-height:20rem;padding:0 0 1.875rem;border-top-left-radius:.5rem;border-top-right-radius:.5rem;overflow:hidden}.group-heading[data-v-5e4d908e]{margin:0 2.5rem .375rem;padding-top:.5rem;font-size:.875rem;font-weight:500;line-height:1rem;text-align:left}.group-elements[data-v-5e4d908e]{display:flex;flex-wrap:wrap;width:100%;padding:0 1.875rem}.add-element[data-v-5e4d908e]{width:8.125rem;min-width:8.125rem;height:auto!important;min-height:4.375rem;padding:0!important;white-space:normal}.add-element[data-v-5e4d908e]  .v-btn__content{flex:1 1 100%;flex-direction:column;padding:.375rem;text-transform:none}.add-element .v-icon[data-v-5e4d908e]{padding:.125rem 0;font-size:1.875rem}.add-element .button-text[data-v-5e4d908e]{margin:.625rem 0}";
  styleInject(css_248z$i);
  /* script */

  var __vue_script__$q = script$q;
  /* template */

  var __vue_render__$q = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-bottom-sheet', _vm._g(_vm._b({
      attrs: {
        "max-width": "1240",
        "inset": ""
      }
    }, 'v-bottom-sheet', _vm.$attrs, false), _vm.$listeners), [_c('div', {
      staticClass: "element-container grey lighten-5"
    }, [_c('div', {
      staticClass: "d-flex align-center py-4 px-10"
    }, [_vm._t("header")], 2), _vm._v(" "), _vm._l(_vm.library, function (group) {
      return _c('div', {
        key: group.name
      }, [_c('div', {
        staticClass: "group-heading grey--text text--darken-4"
      }, [_vm._v(_vm._s(group.name))]), _vm._v(" "), _c('div', {
        staticClass: "group-elements"
      }, _vm._l(group.elements, function (element) {
        return _c('v-hover', {
          key: element.position,
          scopedSlots: _vm._u([{
            key: "default",
            fn: function fn(ref) {
              var hover = ref.hover;
              return [_c('v-btn', {
                staticClass: "add-element",
                attrs: {
                  "disabled": !_vm.isAllowed(element.type),
                  "color": hover ? 'secondary accent-2' : 'blue-grey darken-4',
                  "text": ""
                },
                on: {
                  "click": function click($event) {
                    $event.stopPropagation();
                    return _vm.$emit('add', [element]);
                  }
                }
              }, [element.ui.icon ? _c('v-icon', {
                attrs: {
                  "size": "26",
                  "color": "primary darken-3"
                }
              }, [_vm._v("\n              " + _vm._s(element.ui.icon) + "\n            ")]) : _vm._e(), _vm._v(" "), _c('span', {
                staticClass: "button-text body-2"
              }, [_vm._v(_vm._s(element.name))])], 1)];
            }
          }], null, true)
        });
      }), 1)]);
    })], 2)]);
  };

  var __vue_staticRenderFns__$q = [];
  /* style */

  var __vue_inject_styles__$q = undefined;
  /* scoped */

  var __vue_scope_id__$q = "data-v-5e4d908e";
  /* functional template */

  var __vue_is_functional_template__$q = false;
  /* component normalizer */

  function __vue_normalize__$q(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "AddNewElement.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var AddNewElement = __vue_normalize__$q({
    render: __vue_render__$q,
    staticRenderFns: __vue_staticRenderFns__$q
  }, __vue_inject_styles__$q, __vue_script__$q, __vue_scope_id__$q, __vue_is_functional_template__$q);

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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
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

    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  } //


  var script$p$1 = {
    name: 'content-element-preview',
    props: {
      element: {
        type: Object,
        required: true
      },
      selectable: {
        type: Boolean,
        default: false
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      selectionDisabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      disabled: function disabled(vm) {
        return vm.selectionDisabled && !vm.isSelected;
      },
      elementWidth: function elementWidth(vm) {
        return "col-xs-".concat(get__default['default'](vm.element, 'data.width', 12));
      }
    },
    methods: {
      toggleSelection: function toggleSelection() {
        if (!this.selectable || this.disabled) return;
        this.$emit('toggle');
      }
    },
    components: {
      ContentElement: ContentElement$2
    }
  };
  var css_248z$h$1 = ".element-preview-container[data-v-249d7ad5]{display:flex;position:relative;margin:.25rem 0}.element-preview-container .v-input[data-v-249d7ad5]{margin:0}.content-element[data-v-249d7ad5]{flex:1 0;margin:.4375rem 0 0 .25rem;box-shadow:none;border:1px solid #e1e1e1}.content-element.selected[data-v-249d7ad5]{border-style:dashed;border-color:#444}.content-element.selected[data-v-249d7ad5]::after{display:none}.element-preview-container[data-v-249d7ad5]  .contained-content{margin:0}.element-preview-container[data-v-249d7ad5]  .contained-content .message span:not(.heading){display:none}.element-preview-container[data-v-249d7ad5]  .contained-content .ql-editor{word-break:break-all}.element-wrapper[data-v-249d7ad5]{position:relative}.open-element-button[data-v-249d7ad5]{position:absolute;top:0;right:-.75rem;transition:opacity .4s}.open-element-button[data-v-249d7ad5]:not(.visible){opacity:0}";
  styleInject(css_248z$h$1);
  /* script */

  var __vue_script__$p$1 = script$p$1;
  /* template */

  var __vue_render__$p$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "element-preview-container float-none",
      class: _vm.elementWidth
    }, [_vm.selectable ? _c('v-checkbox', {
      attrs: {
        "input-value": _vm.isSelected,
        "disabled": _vm.disabled,
        "color": "primary darken-4"
      },
      on: {
        "click": _vm.toggleSelection
      }
    }) : _vm._e(), _vm._v(" "), _c('v-hover', {
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(ref) {
          var hover = ref.hover;
          return [_c('div', {
            staticClass: "element-wrapper flex-grow-1"
          }, [_c('content-element', _vm._b({
            staticClass: "content-element",
            class: {
              selected: _vm.isSelected
            },
            attrs: {
              "element": _vm.element,
              "set-width": false
            }
          }, 'content-element', _vm.$attrs, false)), _vm._v(" "), _c('v-tooltip', {
            attrs: {
              "open-delay": "400",
              "top": ""
            },
            scopedSlots: _vm._u([{
              key: "activator",
              fn: function fn(ref) {
                var on = ref.on;
                return [_c('v-btn', _vm._g({
                  staticClass: "open-element-button",
                  class: {
                    visible: hover
                  },
                  attrs: {
                    "color": "blue-grey darken-4",
                    "fab": "",
                    "depressed": "",
                    "x-small": ""
                  },
                  on: {
                    "click": function click($event) {
                      $event.stopPropagation();
                      return _vm.$emit('element:open', _vm.element.uid);
                    }
                  }
                }, on), [_c('v-icon', {
                  attrs: {
                    "color": "secondary lighten-4",
                    "dense": ""
                  }
                }, [_vm._v("mdi-open-in-new")])], 1)];
              }
            }], null, true)
          }, [_vm._v(" "), _c('span', [_vm._v("Open in editor")])])], 1)];
        }
      }])
    })], 1);
  };

  var __vue_staticRenderFns__$p$1 = [];
  /* style */

  var __vue_inject_styles__$p$1 = undefined;
  /* scoped */

  var __vue_scope_id__$p$1 = "data-v-249d7ad5";
  /* functional template */

  var __vue_is_functional_template__$p$1 = false;
  /* component normalizer */

  function __vue_normalize__$p$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Element.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentElement$1$1 = __vue_normalize__$p$1({
    render: __vue_render__$p$1,
    staticRenderFns: __vue_staticRenderFns__$p$1
  }, __vue_inject_styles__$p$1, __vue_script__$p$1, __vue_scope_id__$p$1, __vue_is_functional_template__$p$1); //


  var script$o$1 = {
    name: 'content-preview',
    props: {
      contentContainers: {
        type: Array,
        required: true
      },
      selectable: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: true
      },
      allowedTypes: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      selected: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    computed: {
      isSelectionDisabled: function isSelectionDisabled() {
        return this.selectable && !this.multiple && !!this.selected.length;
      },
      selectionMap: function selectionMap(vm) {
        return keyBy__default['default'](vm.selected, 'id');
      },
      processedContainers: function processedContainers() {
        var containers = this.contentContainers,
            allowedTypes = this.allowedTypes;
        if (!allowedTypes.length) return containers;
        return containers.map(function (container) {
          return Object.assign({}, container, {
            elements: container.elements.filter(function (it) {
              return allowedTypes.includes(it.type);
            })
          });
        });
      },
      elements: function elements() {
        var containers = this.processedContainers;
        return containers.reduce(function (acc, it) {
          return acc.concat(it.elements);
        }, []);
      }
    },
    components: {
      ContentElement: ContentElement$1$1
    }
  };
  var css_248z$g$1 = ".content-preview .v-alert[data-v-2013b96d]{display:flex;align-items:center;justify-content:center;height:19rem}.content-preview .content-container[data-v-2013b96d]:last-child{margin-bottom:.625rem}";
  styleInject(css_248z$g$1);
  /* script */

  var __vue_script__$o$1 = script$o$1;
  /* template */

  var __vue_render__$o$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content-preview"
    }, [!_vm.elements.length ? _c('v-alert', {
      staticClass: "mx-4",
      attrs: {
        "color": "grey darken-4",
        "text": ""
      }
    }, [_vm._v("\n    No available elements.\n  ")]) : _vm._e(), _vm._v(" "), _vm._l(_vm.processedContainers, function (container) {
      return _c('div', {
        key: container.id,
        staticClass: "content-container d-flex flex-wrap"
      }, _vm._l(container.elements, function (element) {
        return _c('content-element', {
          key: element.id,
          attrs: {
            "element": element,
            "selectable": _vm.selectable,
            "is-selected": !!_vm.selectionMap[element.id],
            "selection-disabled": _vm.isSelectionDisabled,
            "is-disabled": ""
          },
          on: {
            "toggle": function toggle($event) {
              return _vm.$emit('toggle', element);
            },
            "element:open": function elementOpen($event) {
              return _vm.$emit('element:open', $event);
            }
          }
        });
      }), 1);
    })], 2);
  };

  var __vue_staticRenderFns__$o$1 = [];
  /* style */

  var __vue_inject_styles__$o$1 = undefined;
  /* scoped */

  var __vue_scope_id__$o$1 = "data-v-2013b96d";
  /* functional template */

  var __vue_is_functional_template__$o$1 = false;
  /* component normalizer */

  function __vue_normalize__$o$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentPreview$1 = __vue_normalize__$o$1({
    render: __vue_render__$o$1,
    staticRenderFns: __vue_staticRenderFns__$o$1
  }, __vue_inject_styles__$o$1, __vue_script__$o$1, __vue_scope_id__$o$1, __vue_is_functional_template__$o$1);

  function loader$1(action, name) {
    var minDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return function () {
      var _this = this;

      this[name] = true;
      return pMinDelay_1(Promise.resolve(action.call.apply(action, [this].concat(Array.prototype.slice.call(arguments)))), minDuration).finally(function () {
        return _this[name] = false;
      });
    };
  } //


  var script$n$1 = {
    name: 'select-activity',
    inject: ['$schema'],
    props: {
      selectedElements: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      activities: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        search: ''
      };
    },
    computed: {
      groupedSelection: function groupedSelection(vm) {
        return groupBy__default['default'](vm.selectedElements, 'outlineId');
      },
      expandedActivityIds: function expandedActivityIds(vm) {
        return map__default['default'](vm.activities, 'id');
      },
      activityTree: function activityTree(vm) {
        return utils.toTreeFormat(vm.activities, vm.$schema, []);
      },
      noResultsMessage: function noResultsMessage() {
        var activities = this.activities,
            search = this.search,
            $refs = this.$refs;
        if (!activities.length) return 'Empty repository';
        if (!search || !$refs) return '';
        var _$refs$treeview = $refs.treeview,
            excludedItems = _$refs$treeview.excludedItems,
            nodes = _$refs$treeview.nodes;
        var hasSearchResults = excludedItems.size !== Object.keys(nodes).length;
        return !hasSearchResults && 'No matches found';
      }
    },
    methods: {
      hasContentContainers: function hasContentContainers(type) {
        return this.$schema.isEditable(type);
      },
      getChipLabel: function getChipLabel(_ref) {
        var length = _ref.length;
        return "".concat(length, " ").concat(pluralize__default['default']('element', length), " selected");
      }
    }
  };
  var css_248z$f$1 = ".treeview[data-v-11dfe634]{max-height:19rem;text-align:left;background-color:#fcfcfc;border:1px solid #eee;overflow-y:scroll}.treeview .v-chip.custom-chip[data-v-11dfe634]{border-radius:12px!important}.treeview[data-v-11dfe634]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__content>*,.treeview[data-v-11dfe634]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__root{cursor:auto}";
  styleInject(css_248z$f$1);
  /* script */

  var __vue_script__$n$1 = script$n$1;
  /* template */

  var __vue_render__$n$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "mx-3"
    }, [_c('v-text-field', {
      attrs: {
        "disabled": !_vm.activities.length,
        "placeholder": "Filter items...",
        "prepend-inner-icon": "mdi-filter-outline",
        "clear-icon": "mdi-close-circle-outline",
        "clearable": "",
        "outlined": ""
      },
      model: {
        value: _vm.search,
        callback: function callback($$v) {
          _vm.search = $$v;
        },
        expression: "search"
      }
    }), _vm._v(" "), _c('v-treeview', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: !_vm.noResultsMessage,
        expression: "!noResultsMessage"
      }],
      ref: "treeview",
      staticClass: "py-3 px-1 treeview",
      attrs: {
        "items": _vm.activityTree,
        "search": _vm.search,
        "open": _vm.expandedActivityIds,
        "transition": "",
        "open-on-click": ""
      },
      scopedSlots: _vm._u([{
        key: "label",
        fn: function fn(ref) {
          var ref_item = ref.item;
          var id = ref_item.id;
          var data = ref_item.data;
          return [_vm._v("\n      " + _vm._s(data.name) + "\n      "), _vm.groupedSelection[id] ? _c('v-chip', {
            staticClass: "readonly custom-chip",
            attrs: {
              "rounded": "",
              "small": ""
            }
          }, [_vm._v("\n        " + _vm._s(_vm.getChipLabel(_vm.groupedSelection[id])) + "\n      ")]) : _vm._e()];
        }
      }, {
        key: "append",
        fn: function fn(ref) {
          var item = ref.item;
          return [_vm.hasContentContainers(item.type) ? _c('v-btn', {
            attrs: {
              "color": "primary darken-2",
              "outlined": "",
              "small": ""
            },
            on: {
              "click": function click($event) {
                return _vm.$emit('selected', item);
              }
            }
          }, [_vm._v("\n        View elements\n      ")]) : _vm._e()];
        }
      }])
    }), _vm._v(" "), _c('v-alert', {
      attrs: {
        "value": !!_vm.noResultsMessage,
        "color": "primary darken-2",
        "dark": ""
      }
    }, [_vm._v("\n    " + _vm._s(_vm.noResultsMessage) + "\n  ")])], 1);
  };

  var __vue_staticRenderFns__$n$1 = [];
  /* style */

  var __vue_inject_styles__$n$1 = undefined;
  /* scoped */

  var __vue_scope_id__$n$1 = "data-v-11dfe634";
  /* functional template */

  var __vue_is_functional_template__$n$1 = false;
  /* component normalizer */

  function __vue_normalize__$n$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "SelectActivity.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectActivity$1 = __vue_normalize__$n$1({
    render: __vue_render__$n$1,
    staticRenderFns: __vue_staticRenderFns__$n$1
  }, __vue_inject_styles__$n$1, __vue_script__$n$1, __vue_scope_id__$n$1, __vue_is_functional_template__$n$1); //


  var script$m$1 = {
    name: 'select-repository',
    props: {
      repository: {
        type: Object,
        default: null
      }
    },
    data: function data() {
      return {
        repositories: [],
        loading: false
      };
    },
    methods: {
      selectRepository: function selectRepository(repository) {
        if (find__default['default'](this.repositories, {
          id: repository.id
        })) {
          this.$emit('selected', repository);
        }
      },
      fetchRepositories: debounce__default['default'](loader$1(function (search) {
        var _this = this;

        return api.repository.getRepositories({
          search: search
        }).then(function (repositories) {
          _this.repositories = sortBy__default['default'](repositories, 'name');
        });
      }, 'loading'), 500)
    },
    created: function created() {
      this.fetchRepositories();
    }
  };
  /* script */

  var __vue_script__$m$1 = script$m$1;
  /* template */

  var __vue_render__$m$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-combobox', _vm._b({
      staticClass: "mx-3",
      attrs: {
        "value": _vm.repository,
        "items": _vm.repositories,
        "loading": _vm.loading,
        "item-value": "id",
        "item-text": "name",
        "label": "Select repository",
        "placeholder": "Type to search repositories...",
        "outlined": "",
        "return-object": ""
      },
      on: {
        "input": _vm.selectRepository,
        "update:search-input": _vm.fetchRepositories
      }
    }, 'v-combobox', _vm.$attrs, false));
  };

  var __vue_staticRenderFns__$m$1 = [];
  /* style */

  var __vue_inject_styles__$m$1 = undefined;
  /* scoped */

  var __vue_scope_id__$m$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$m$1 = false;
  /* component normalizer */

  function __vue_normalize__$m$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "SelectRepository.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectRepository$1 = __vue_normalize__$m$1({
    render: __vue_render__$m$1,
    staticRenderFns: __vue_staticRenderFns__$m$1
  }, __vue_inject_styles__$m$1, __vue_script__$m$1, __vue_scope_id__$m$1, __vue_is_functional_template__$m$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$l$1 = {
    name: 'tailor-dialog',
    props: {
      headerIcon: {
        type: String,
        default: null
      },
      width: {
        type: [Number, String],
        default: 500
      },
      paddingless: {
        type: Boolean,
        default: false
      }
    }
  };
  var css_248z$e$1 = ".dialog-title[data-v-b6f646a2]{display:flex;color:#f1f1f1}.dialog-title .text-truncate[data-v-b6f646a2]{flex:1;text-align:left}";
  styleInject(css_248z$e$1);
  /* script */

  var __vue_script__$l$1 = script$l$1;
  /* template */

  var __vue_render__$l$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-dialog', _vm._g(_vm._b({
      attrs: {
        "width": _vm.width
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (_, slot) {
        return {
          key: slot,
          fn: function fn(scope) {
            return [_vm._t(slot, null, null, scope)];
          }
        };
      })], null, true)
    }, 'v-dialog', _vm.$attrs, false), _vm.$listeners), [_vm._v(" "), _c('v-card', [_c('v-card-title', {
      staticClass: "dialog-title primary darken-3",
      attrs: {
        "primary-title": ""
      }
    }, [_vm.headerIcon ? _c('v-avatar', {
      staticClass: "mr-3",
      attrs: {
        "color": "secondary",
        "size": "38"
      }
    }, [_c('v-icon', {
      attrs: {
        "dark": ""
      }
    }, [_vm._v(_vm._s(_vm.headerIcon))])], 1) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "text-truncate"
    }, [_vm._t("header")], 2)], 1), _vm._v(" "), _c('v-card-text', {
      class: [_vm.paddingless ? 'pa-0' : 'pt-7 px-4 pb-2']
    }, [_vm._t("body")], 2), _vm._v(" "), _vm.$slots.actions ? _c('v-card-actions', {
      staticClass: "px-4 pb-3"
    }, [_c('v-spacer'), _vm._v(" "), _vm._t("actions")], 2) : _vm._e()], 1)], 1);
  };

  var __vue_staticRenderFns__$l$1 = [];
  /* style */

  var __vue_inject_styles__$l$1 = undefined;
  /* scoped */

  var __vue_scope_id__$l$1 = "data-v-b6f646a2";
  /* functional template */

  var __vue_is_functional_template__$l$1 = false;
  /* component normalizer */

  function __vue_normalize__$l$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "TailorDialog.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var TailorDialog$1 = __vue_normalize__$l$1({
    render: __vue_render__$l$1,
    staticRenderFns: __vue_staticRenderFns__$l$1
  }, __vue_inject_styles__$l$1, __vue_script__$l$1, __vue_scope_id__$l$1, __vue_is_functional_template__$l$1);

  var TOGGLE_BUTTON$1 = {
    SELECT: {
      label: 'Select all',
      icon: 'checkbox-multiple-marked-outline'
    },
    DESELECT: {
      label: 'Deselect all',
      icon: 'checkbox-multiple-blank-outline'
    }
  };
  var script$k$1 = {
    name: 'select-element',
    inject: ['$schema'],
    props: {
      selected: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      heading: {
        type: String,
        required: true
      },
      allowedTypes: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      submitLabel: {
        type: String,
        default: 'Save'
      },
      headerIcon: {
        type: String,
        default: 'mdi-toy-brick-plus-outline'
      },
      onlyCurrentRepo: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        items: {
          activities: [],
          contentContainers: []
        },
        selection: {
          repository: null,
          activity: null,
          elements: []
        },
        loadingContent: false
      };
    },
    computed: Object.assign({}, mapGetters('repository', {
      currentRepository: 'repository',
      currentActivities: 'activities'
    }), {
      allElementsSelected: function allElementsSelected(vm) {
        return vm.selection.elements.length === vm.elements.length;
      },
      rootContainerTypes: function rootContainerTypes() {
        var _this$selection$activ;

        var type = (_this$selection$activ = this.selection.activity) === null || _this$selection$activ === void 0 ? void 0 : _this$selection$activ.type;
        return type && this.getContainerTypes(type);
      },
      processedContainers: function processedContainers() {
        var _this = this;

        var activity = this.selection.activity,
            activities = this.items.activities;
        if (!activity || !activities.length) return [];
        var containers = sortBy__default['default'](activities.filter(this.isRootContainer), [this.getTypePosition, 'position', 'createdAt']);
        return flatMap__default['default'](containers, function (it) {
          return [it].concat(_toConsumableArray(_this.getSubcontainers(it)));
        });
      },
      elements: function elements() {
        var _this2 = this;

        var elements = flatMap__default['default'](this.items.contentContainers, 'elements');
        if (!this.allowedTypes.length) return elements;
        return elements.filter(function (it) {
          return _this2.allowedTypes.includes(it.type);
        });
      },
      toggleButton: function toggleButton() {
        var allElementsSelected = this.allElementsSelected,
            elements = this.elements,
            multiple = this.multiple,
            selection = this.selection;
        if (!multiple || !selection.activity || !elements.length) return;
        var SELECT = TOGGLE_BUTTON$1.SELECT,
            DESELECT = TOGGLE_BUTTON$1.DESELECT;
        return allElementsSelected ? DESELECT : SELECT;
      }
    }),
    methods: {
      getContainerTypes: function getContainerTypes(type) {
        return map__default['default'](this.$schema.getSupportedContainers(type), 'type');
      },
      getTypePosition: function getTypePosition(_ref) {
        var type = _ref.type;
        return this.rootContainerTypes.indexOf(type);
      },
      isRootContainer: function isRootContainer(_ref2) {
        var parentId = _ref2.parentId,
            type = _ref2.type;
        var activity = this.selection.activity,
            rootContainerTypes = this.rootContainerTypes;
        return parentId === activity.id && rootContainerTypes.includes(type);
      },
      getSubcontainers: function getSubcontainers(container) {
        var activities = this.items.activities;
        return sortBy__default['default'](utils.getDescendants(activities, container), 'position');
      },
      showActivityElements: async function showActivityElements(activity) {
        var _this3 = this;

        this.selection.activity = activity;
        var processedContainers = this.processedContainers;
        var elements = await this.fetchElements(processedContainers);
        this.items.contentContainers = processedContainers.map(function (container) {
          return _this3.assignElements(container, activity, elements);
        });
      },
      assignElements: function assignElements(container, activity, elements) {
        var containerElements = elements.filter(function (it) {
          return it.activityId === container.id;
        }).map(function (element) {
          return Object.assign({}, element, {
            activity: activity
          });
        });
        return Object.assign({}, container, {
          elements: sortBy__default['default'](containerElements, 'position')
        });
      },
      toggleElementSelection: function toggleElementSelection(element) {
        var elements = this.selection.elements;
        var existing = elements.find(function (it) {
          return it.id === element.id;
        });
        this.selection.elements = existing ? elements.filter(function (it) {
          return it.id !== element.id;
        }) : elements.concat(element);
      },
      toggleSelectAll: function toggleSelectAll() {
        this.selection.elements = this.allElementsSelected ? [] : this.elements;
      },
      deselectActivity: function deselectActivity() {
        this.selection.activity = null;
        this.items.contentContainers = [];
        this.selection.elements = _toConsumableArray(this.selected);
      },
      selectRepository: async function selectRepository(repository) {
        var currentActivities = this.currentActivities,
            currentRepository = this.currentRepository;
        this.selection.repository = repository;
        this.deselectActivity();
        this.items.activities = currentRepository.id === repository.id ? currentActivities : await this.fetchActivities(repository);
      },
      fetchActivities: loader$1(function (repository) {
        return api.activity.getActivities(repository.id);
      }, 'loadingContent'),
      fetchElements: loader$1(function (containers) {
        var repositoryId = this.selection.repository.id;
        var queryOpts = {
          repositoryId: repositoryId,
          ids: containers.map(function (it) {
            return it.id;
          })
        };
        return api.contentElement.fetch(queryOpts);
      }, 'loadingContent', 500),
      save: function save() {
        this.$emit('selected', _toConsumableArray(this.selection.elements));
        this.close();
      },
      close: function close() {
        this.$emit('close');
      },
      openInEditor: function openInEditor(elementId) {
        var params = {
          activityId: this.selection.activity.id,
          repositoryId: this.selection.repository.id
        };
        var route = {
          name: 'editor',
          params: params,
          query: {
            elementId: elementId
          }
        };

        var _this$$router$resolve = this.$router.resolve(route),
            href = _this$$router$resolve.href;

        window.open(href, '_blank');
      }
    },
    created: function created() {
      this.selection.elements = _toConsumableArray(this.selected);
      this.selection.repository = this.currentRepository;
      this.items.activities = this.currentActivities;
    },
    components: {
      ContentPreview: ContentPreview$1,
      SelectActivity: SelectActivity$1,
      SelectRepository: SelectRepository$1,
      TailorDialog: TailorDialog$1
    }
  };
  /* script */

  var __vue_script__$k$1 = script$k$1;
  /* template */

  var __vue_render__$k$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('tailor-dialog', {
      attrs: {
        "value": true,
        "header-icon": _vm.headerIcon,
        "width": "650",
        "scrollable": ""
      },
      on: {
        "click:outside": _vm.close
      },
      scopedSlots: _vm._u([{
        key: "header",
        fn: function fn() {
          return [_vm._v(_vm._s(_vm.heading))];
        },
        proxy: true
      }, {
        key: "body",
        fn: function fn() {
          return [!_vm.selection.activity ? [_c('select-repository', {
            attrs: {
              "repository": _vm.selection.repository,
              "disabled": _vm.onlyCurrentRepo
            },
            on: {
              "selected": _vm.selectRepository
            }
          }), _vm._v(" "), _vm.loadingContent ? _c('v-progress-circular', {
            staticClass: "mt-5",
            attrs: {
              "indeterminate": ""
            }
          }) : _c('select-activity', {
            attrs: {
              "activities": _vm.items.activities,
              "selected-elements": _vm.selection.elements
            },
            on: {
              "selected": _vm.showActivityElements
            }
          })] : [_vm.toggleButton ? _c('div', {
            staticClass: "d-flex justify-end mb-2 px-4"
          }, [_c('v-btn', {
            attrs: {
              "outlined": ""
            },
            on: {
              "click": _vm.toggleSelectAll
            }
          }, [_c('v-icon', {
            staticClass: "mr-2"
          }, [_vm._v("mdi-" + _vm._s(_vm.toggleButton.icon))]), _vm._v("\n          " + _vm._s(_vm.toggleButton.label) + "\n        ")], 1)], 1) : _vm._e(), _vm._v(" "), _vm.loadingContent ? _c('v-progress-circular', {
            staticClass: "mt-5",
            attrs: {
              "indeterminate": ""
            }
          }) : _c('content-preview', {
            attrs: {
              "content-containers": _vm.items.contentContainers,
              "selected": _vm.selection.elements,
              "allowed-types": _vm.allowedTypes,
              "multiple": _vm.multiple,
              "selectable": ""
            },
            on: {
              "toggle": _vm.toggleElementSelection,
              "element:open": _vm.openInEditor
            }
          })]];
        },
        proxy: true
      }, {
        key: "actions",
        fn: function fn() {
          return [_vm.selection.activity ? _c('v-btn', {
            staticClass: "mr-2",
            attrs: {
              "text": "",
              "outlined": ""
            },
            on: {
              "click": _vm.deselectActivity
            }
          }, [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "dense": ""
            }
          }, [_vm._v("mdi-arrow-left")]), _vm._v("Back\n    ")], 1) : _vm._e(), _vm._v(" "), _c('v-btn', {
            staticClass: "ml-1",
            attrs: {
              "text": ""
            },
            on: {
              "click": _vm.close
            }
          }, [_vm._v("Cancel")]), _vm._v(" "), _c('v-btn', {
            staticClass: "mr-2",
            attrs: {
              "text": ""
            },
            on: {
              "click": _vm.save
            }
          }, [_vm._v(_vm._s(_vm.submitLabel))])];
        },
        proxy: true
      }])
    });
  };

  var __vue_staticRenderFns__$k$1 = [];
  /* style */

  var __vue_inject_styles__$k$1 = undefined;
  /* scoped */

  var __vue_scope_id__$k$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$k$1 = false;
  /* component normalizer */

  function __vue_normalize__$k$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectElement$1 = __vue_normalize__$k$1({
    render: __vue_render__$k$1,
    staticRenderFns: __vue_staticRenderFns__$k$1
  }, __vue_inject_styles__$k$1, __vue_script__$k$1, __vue_scope_id__$k$1, __vue_is_functional_template__$k$1); //


  var DEFAULT_ELEMENT_WIDTH$1 = 100;
  var LAYOUT$1 = {
    HALF_WIDTH: 6,
    FULL_WIDTH: 12
  };
  var ELEMENT_GROUPS$1 = [{
    name: 'Content Elements',
    icon: 'mdi-set-center'
  }, {
    name: 'Assessments',
    icon: 'mdi-help-rhombus'
  }, {
    name: 'Nongraded questions',
    icon: 'mdi-comment-question-outline'
  }];

  var getQuestionData$1 = function getQuestionData(element, type) {
    var data = {
      width: LAYOUT$1.FULL_WIDTH
    };
    var question = [{
      id: utils.uuid(),
      data: data,
      type: 'JODIT_HTML',
      embedded: true
    }];
    return Object.assign({
      question: question,
      type: type
    }, element.data);
  };

  var script$j$1 = {
    name: 'tailor-add-element',
    inject: ['$teRegistry'],
    props: {
      items: {
        type: Array,
        required: true
      },
      activity: {
        type: Object,
        default: null
      },
      position: {
        type: Number,
        default: null
      },
      layout: {
        type: Boolean,
        default: true
      },
      include: {
        type: Array,
        default: null
      },
      show: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: 'Add content'
      },
      icon: {
        type: String,
        default: 'mdi-plus'
      }
    },
    data: function data() {
      return {
        isVisible: false,
        elementWidth: DEFAULT_ELEMENT_WIDTH$1,
        showElementBrowser: false
      };
    },
    computed: {
      registry: function registry() {
        return this.$teRegistry.all;
      },
      questions: function questions() {
        return filter__default['default'](this.registry, {
          type: 'QUESTION'
        });
      },
      contentElements: function contentElements() {
        var _this = this;

        var items = filter__default['default'](this.registry, function (it) {
          return !utils.isQuestion(it.type);
        });
        if (!this.isSubset) return items;
        return filter__default['default'](items, function (it) {
          return _this.include.includes(it.type);
        });
      },
      assessments: function assessments() {
        var registry = this.registry,
            isSubset = this.isSubset,
            include = this.include,
            questions = this.questions;
        if (isSubset && !include.includes('ASSESSMENT')) return [];
        return filter__default['default'](registry, {
          type: 'ASSESSMENT'
        }).concat(questions.map(function (it) {
          return Object.assign({}, it, {
            type: 'ASSESSMENT'
          });
        }));
      },
      reflections: function reflections() {
        var registry = this.registry,
            isSubset = this.isSubset,
            include = this.include,
            questions = this.questions;
        if (isSubset && !include.includes('REFLECTION')) return [];
        return filter__default['default'](registry, {
          type: 'REFLECTION'
        }).concat(questions.map(function (it) {
          return Object.assign({}, it, {
            type: 'REFLECTION'
          });
        }));
      },
      isSubset: function isSubset() {
        return !!this.include && !!this.include.length;
      },
      library: function library() {
        var groups = [this.contentElements, this.assessments, this.reflections];
        return reduce__default['default'](groups, function (acc, elements, i) {
          if (elements.length) acc.push(Object.assign({}, ELEMENT_GROUPS$1[i], {
            elements: elements
          }));
          return acc;
        }, []);
      },
      processedWidth: function processedWidth() {
        return this.elementWidth === 50 ? LAYOUT$1.HALF_WIDTH : LAYOUT$1.FULL_WIDTH;
      },
      allowedTypes: function allowedTypes() {
        var elementWidth = this.elementWidth,
            include = this.include,
            layout = this.layout,
            library = this.library;
        var elements = flatMap__default['default'](library, 'elements');
        if (!layout) return include || [];
        var allowedElements = elementWidth === DEFAULT_ELEMENT_WIDTH$1 ? elements : reject__default['default'](elements, 'ui.forceFullWidth');
        var allowedTypes = allowedElements.map(function (it) {
          return it.type;
        });
        return include ? intersection__default['default'](include, allowedTypes) : allowedTypes;
      }
    },
    methods: {
      addElements: function addElements(elements) {
        var _this2 = this;

        var positions = utils.getPositions(this.items, this.position, elements.length);
        var items = elements.map(function (it, index) {
          return _this2.buildElement(Object.assign({}, it, {
            position: positions[index]
          }));
        });
        this.$emit('add', items);
        this.isVisible = false;
      },
      buildElement: function buildElement(el) {
        var width = this.processedWidth,
            activity = this.activity;
        var position = el.position,
            subtype = el.subtype,
            _el$data = el.data,
            data = _el$data === void 0 ? {} : _el$data,
            _el$initState = el.initState,
            initState = _el$initState === void 0 ? function () {
          return {};
        } : _el$initState;
        var element = Object.assign({
          position: position
        }, pick__default['default'](el, ['type', 'refs']), {
          data: Object.assign({}, initState(), data, {
            width: width
          })
        });
        var contextData = activity ? {
          activityId: activity.id
        } // If content element within activity
        : {
          id: utils.uuid(),
          embedded: true
        }; // If embed, assign id

        Object.assign(element, contextData);
        if (utils.isQuestion(element.type)) element.data = getQuestionData$1(element, subtype);
        if (element.type === 'REFLECTION') delete element.data.correct;
        return element;
      },
      onHidden: function onHidden() {
        this.elementWidth = DEFAULT_ELEMENT_WIDTH$1;
        this.$emit('hidden');
      },
      showElementPicker: function showElementPicker() {
        this.isVisible = true;
      }
    },
    watch: {
      isVisible: function isVisible(val, oldVal) {
        if (!val && oldVal) this.onHidden();
      },
      show: function show(val) {
        return val ? this.showElementPicker() : this.onHidden();
      }
    },
    components: {
      AddNewElement: AddNewElement,
      SelectElement: SelectElement$1
    }
  };
  /* script */

  var __vue_script__$j$1 = script$j$1;
  /* template */

  var __vue_render__$j$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "add-element-container"
    }, [_vm._t("default", [_vm.large ? _c('v-btn', {
      staticClass: "mt-3 mb-4",
      attrs: {
        "color": "primary darken-3",
        "text": ""
      },
      on: {
        "click": function click($event) {
          $event.stopPropagation();
          return _vm.showElementPicker($event);
        }
      }
    }, [_c('v-icon', {
      staticClass: "pr-2"
    }, [_vm._v(_vm._s(_vm.icon))]), _vm._v(_vm._s(_vm.label) + "\n    ")], 1) : _c('v-btn', {
      attrs: {
        "color": "primary darken-3",
        "icon": "",
        "text": ""
      },
      on: {
        "click": function click($event) {
          $event.stopPropagation();
          return _vm.showElementPicker($event);
        }
      }
    }, [_c('v-icon', [_vm._v(_vm._s(_vm.icon))])], 1)], {
      "addElement": _vm.showElementPicker
    }), _vm._v(" "), _vm.isVisible ? [_vm.showElementBrowser ? _c('select-element', {
      attrs: {
        "allowed-types": _vm.allowedTypes,
        "submit-label": "Copy",
        "heading": "Copy elements",
        "header-icon": "mdi-content-duplicate",
        "multiple": ""
      },
      on: {
        "selected": _vm.addElements,
        "close": function close($event) {
          _vm.showElementBrowser = false;
        }
      }
    }) : _c('add-new-element', {
      attrs: {
        "library": _vm.library,
        "allowed-types": _vm.allowedTypes
      },
      on: {
        "add": _vm.addElements
      },
      scopedSlots: _vm._u([{
        key: "header",
        fn: function fn() {
          return [_vm.layout ? _c('div', {
            staticClass: "mr-6"
          }, [_c('div', {
            staticClass: "pb-1 caption text-left"
          }, [_vm._v("Element width")]), _vm._v(" "), _c('v-btn-toggle', {
            attrs: {
              "color": "secondary accent-2",
              "mandatory": ""
            },
            model: {
              value: _vm.elementWidth,
              callback: function callback($$v) {
                _vm.elementWidth = $$v;
              },
              expression: "elementWidth"
            }
          }, [_c('v-btn', {
            attrs: {
              "value": 100,
              "height": "38",
              "icon": ""
            }
          }, [_c('v-icon', [_vm._v("mdi-square-outline")])], 1), _vm._v(" "), _c('v-btn', {
            attrs: {
              "value": 50,
              "height": "38",
              "icon": ""
            }
          }, [_c('v-icon', [_vm._v("mdi-select-compare")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), _c('v-btn', {
            staticClass: "mt-6",
            attrs: {
              "color": "primary darken-3",
              "depressed": ""
            },
            on: {
              "click": function click($event) {
                _vm.showElementBrowser = !_vm.showElementBrowser;
              }
            }
          }, [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "dense": ""
            }
          }, [_vm._v("mdi-content-copy")]), _vm._v("\n          Copy existing\n        ")], 1)];
        },
        proxy: true
      }], null, false, 2543524328),
      model: {
        value: _vm.isVisible,
        callback: function callback($$v) {
          _vm.isVisible = $$v;
        },
        expression: "isVisible"
      }
    })] : _vm._e()], 2);
  };

  var __vue_staticRenderFns__$j$1 = [];
  /* style */

  var __vue_inject_styles__$j$1 = undefined;
  /* scoped */

  var __vue_scope_id__$j$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$j$1 = false;
  /* component normalizer */

  function __vue_normalize__$j$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var AddElement$1 = __vue_normalize__$j$1({
    render: __vue_render__$j$1,
    staticRenderFns: __vue_staticRenderFns__$j$1
  }, __vue_inject_styles__$j$1, __vue_script__$j$1, __vue_scope_id__$j$1, __vue_is_functional_template__$j$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$i$1 = {
    name: 'tailor-editor-link',
    props: {
      activityId: {
        type: Number,
        required: true
      },
      elementUid: {
        type: String,
        default: null
      },
      label: {
        type: String,
        required: true
      }
    },
    computed: {
      editorRoute: function editorRoute(_ref) {
        var activityId = _ref.activityId,
            elementUid = _ref.elementUid;
        return Object.assign({
          name: 'editor',
          params: {
            activityId: activityId
          }
        }, elementUid && {
          query: {
            elementId: elementUid
          }
        });
      }
    }
  };
  /* script */

  var __vue_script__$i$1 = script$i$1;
  /* template */

  var __vue_render__$i$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "editor-link"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('router-link', {
            attrs: {
              "to": _vm.editorRoute
            },
            scopedSlots: _vm._u([{
              key: "default",
              fn: function fn(ref) {
                var navigate = ref.navigate;
                var isExactActive = ref.isExactActive;
                return [_c('v-btn', _vm._g(_vm._b({
                  attrs: {
                    "color": isExactActive ? 'teal accent-4' : 'primary',
                    "text": "",
                    "x-small": ""
                  },
                  on: {
                    "click": navigate
                  }
                }, 'v-btn', _vm.$attrs, false), on), [_vm._v("\n          " + _vm._s(_vm.label) + "\n          "), _vm._t("icon", [_c('v-icon', {
                  staticClass: "ml-1",
                  attrs: {
                    "x-small": ""
                  }
                }, [_vm._v("mdi-arrow-top-right-thick")])])], 2)];
              }
            }], null, true)
          })];
        }
      }])
    }, [_vm._v(" "), _vm._t("tooltip", [_c('span', [_vm._v("View element")])])], 2)], 1);
  };

  var __vue_staticRenderFns__$i$1 = [];
  /* style */

  var __vue_inject_styles__$i$1 = undefined;
  /* scoped */

  var __vue_scope_id__$i$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$i$1 = false;
  /* component normalizer */

  function __vue_normalize__$i$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "EditorLink.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var EditorLink$1 = __vue_normalize__$i$1({
    render: __vue_render__$i$1,
    staticRenderFns: __vue_staticRenderFns__$i$1
  }, __vue_inject_styles__$i$1, __vue_script__$i$1, __vue_scope_id__$i$1, __vue_is_functional_template__$i$1); //


  var getOptions$1 = function getOptions() {
    return {
      resolve: {
        action: 'resolve',
        icon: 'check-box-outline',
        color: 'teal accent-4'
      },
      edit: {
        action: 'toggleEdit',
        icon: 'pencil-outline',
        color: 'grey'
      },
      remove: {
        action: 'remove',
        icon: 'trash-can-outline',
        color: 'grey'
      }
    };
  };

  var script$h$1 = {
    name: 'comment-header',
    props: {
      comment: {
        type: Object,
        required: true
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      isResolved: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    computed: {
      elementUid: function elementUid(vm) {
        return vm.comment.contentElement.uid;
      },
      author: function author(vm) {
        return vm.comment.author;
      },
      isAuthor: function isAuthor(vm) {
        return vm.author.id === vm.user.id;
      },
      isDeleted: function isDeleted(vm) {
        return !!vm.comment.deletedAt;
      },
      showEditedLabel: function showEditedLabel(vm) {
        return !!vm.comment.editedAt;
      },
      showOptions: function showOptions(vm) {
        return vm.isAuthor && !vm.isDeleted && !vm.isResolved;
      },
      options: function options() {
        var options = getOptions$1();
        if (this.isActivityThread) delete options.resolve;
        return options;
      }
    },
    components: {
      EditorLink: EditorLink$1
    }
  };
  var css_248z$d$1 = ".header[data-v-a1e0c4e8]{display:flex;align-items:flex-start}.header .comment-avatar[data-v-a1e0c4e8]{margin:.375rem .375rem 0 0}.header .info-container[data-v-a1e0c4e8]{display:flex;flex-direction:column;flex:0 100%;max-width:calc(100% - 8rem);margin-left:.125rem}.header .info-container .author[data-v-a1e0c4e8]{display:inline-block;max-width:75%;color:#000;font-size:1rem}.header .info-container .edited[data-v-a1e0c4e8],.header .info-container .time[data-v-a1e0c4e8]{color:#888;font-size:.75rem}.header .info-container hr.v-divider--vertical[data-v-a1e0c4e8]{margin:.25rem .125rem .125rem .625rem}.header .info-container[data-v-a1e0c4e8]  .editor-link{display:inline-flex;align-self:flex-end}.header .actions[data-v-a1e0c4e8]{margin-left:auto}";
  styleInject(css_248z$d$1);
  /* script */

  var __vue_script__$h$1 = script$h$1;
  /* template */

  var __vue_render__$h$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "header"
    }, [_c('v-avatar', {
      staticClass: "comment-avatar",
      attrs: {
        "size": "34"
      }
    }, [_c('img', {
      attrs: {
        "src": _vm.author.imgUrl
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "info-container"
    }, [_c('div', {
      staticClass: "d-flex align-center"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('span', _vm._g({
            staticClass: "author text-truncate"
          }, on), [_vm._v(_vm._s(_vm.author.label))])];
        }
      }])
    }, [_vm._v("\n        " + _vm._s(_vm.author.label) + "\n      ")]), _vm._v(" "), _vm.showEditedLabel ? _c('span', {
      staticClass: "edited ml-1"
    }, [_vm._v("(edited)")]) : _vm._e()], 1), _vm._v(" "), _c('div', {
      staticClass: "d-flex align-center"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('span', _vm._g({}, on), [_c('timeago', {
            staticClass: "time",
            attrs: {
              "datetime": _vm.comment.createdAt,
              "auto-update": 60
            }
          })], 1)];
        }
      }])
    }, [_vm._v(" "), _c('span', [_vm._v(_vm._s(_vm._f("formatDate")(_vm.comment.createdAt, 'DD. MMM h:mm A')))])]), _vm._v(" "), _vm.isActivityThread && _vm.elementLabel ? [_c('v-divider', {
      attrs: {
        "vertical": ""
      }
    }), _vm._v(" "), _c('editor-link', {
      attrs: {
        "activity-id": _vm.comment.activityId,
        "element-uid": _vm.elementUid,
        "label": _vm.elementLabel
      }
    })] : _vm._e()], 2)]), _vm._v(" "), _vm.showOptions ? _c('div', {
      staticClass: "actions"
    }, _vm._l(_vm.options, function (ref, name) {
      var action = ref.action;
      var icon = ref.icon;
      var color = ref.color;
      return _c('v-btn', {
        key: name,
        staticClass: "ml-1",
        attrs: {
          "x-small": "",
          "icon": ""
        },
        on: {
          "click": function click($event) {
            return _vm.$emit(action);
          }
        }
      }, [_c('v-icon', {
        attrs: {
          "color": color,
          "size": "14"
        }
      }, [_vm._v(" mdi-" + _vm._s(icon))])], 1);
    }), 1) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$h$1 = [];
  /* style */

  var __vue_inject_styles__$h$1 = undefined;
  /* scoped */

  var __vue_scope_id__$h$1 = "data-v-a1e0c4e8";
  /* functional template */

  var __vue_is_functional_template__$h$1 = false;
  /* component normalizer */

  function __vue_normalize__$h$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Header.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var CommentHeader$1 = __vue_normalize__$h$1({
    render: __vue_render__$h$1,
    staticRenderFns: __vue_staticRenderFns__$h$1
  }, __vue_inject_styles__$h$1, __vue_script__$h$1, __vue_scope_id__$h$1, __vue_is_functional_template__$h$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$g$1 = {
    name: 'comment-preview',
    props: {
      content: {
        type: String,
        default: ''
      },
      isResolved: {
        type: Boolean,
        default: false
      }
    }
  };
  var css_248z$c$1 = ".content[data-v-3d625308]{margin-top:.375rem}.content pre[data-v-3d625308]{height:100%;margin:0;padding:0 .25rem .5rem 0;font:inherit;white-space:pre-wrap;word-break:break-all;word-wrap:break-word;overflow-wrap:break-word;background:inherit;border:none;overflow:hidden}.content.resolved[data-v-3d625308]{opacity:.7}.content.resolved .resolvement-options[data-v-3d625308]{display:flex;align-items:center;margin-bottom:.25rem;font-size:.75rem}";
  styleInject(css_248z$c$1);
  /* script */

  var __vue_script__$g$1 = script$g$1;
  /* template */

  var __vue_render__$g$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content",
      class: {
        resolved: _vm.isResolved
      }
    }, [_vm.isResolved ? _c('div', {
      staticClass: "resolvement-options"
    }, [_c('span', {
      staticClass: "font-italic mr-1"
    }, [_vm._v("Marked as resolved.")]), _vm._v(" "), _c('v-tooltip', {
      attrs: {
        "open-delay": "800",
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('v-btn', _vm._g({
            attrs: {
              "color": "secondary",
              "text": "",
              "x-small": ""
            },
            on: {
              "click": _vm.$listeners.unresolve
            }
          }, on), [_vm._v("\n          Undo\n        ")])];
        }
      }], null, false, 3181083862)
    }, [_vm._v(" "), _c('span', [_vm._v("Unresolve comment")])])], 1) : _vm._e(), _vm._v(" "), _c('pre', [_c('span', [_vm._v(_vm._s(_vm.content))]), _c('br')])]);
  };

  var __vue_staticRenderFns__$g$1 = [];
  /* style */

  var __vue_inject_styles__$g$1 = undefined;
  /* scoped */

  var __vue_scope_id__$g$1 = "data-v-3d625308";
  /* functional template */

  var __vue_is_functional_template__$g$1 = false;
  /* component normalizer */

  function __vue_normalize__$g$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Preview.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var CommentPreview$1 = __vue_normalize__$g$1({
    render: __vue_render__$g$1,
    staticRenderFns: __vue_staticRenderFns__$g$1
  }, __vue_inject_styles__$g$1, __vue_script__$g$1, __vue_scope_id__$g$1, __vue_is_functional_template__$g$1); //


  var script$f$1 = {
    name: 'thread-comment',
    props: {
      comment: {
        type: Object,
        required: true
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data(vm) {
      return {
        content: vm.comment.content,
        isEditing: false
      };
    },
    computed: {
      isResolved: function isResolved(_ref) {
        var comment = _ref.comment;
        return !!comment.resolvedAt;
      }
    },
    methods: {
      toggleEdit: function toggleEdit() {
        this.isEditing = !this.isEditing;
      },
      save: function save() {
        var comment = this.comment,
            content = this.content;
        if (!content) return this.remove();
        this.toggleEdit();
        this.$emit('update', comment, content);
      },
      remove: function remove() {
        this.$emit('remove', this.comment);
      },
      reset: function reset() {
        this.content = this.comment.content;
        this.isEditing = false;
      }
    },
    watch: {
      comment: {
        deep: true,
        handler: 'reset'
      }
    },
    components: {
      CommentHeader: CommentHeader$1,
      CommentPreview: CommentPreview$1
    }
  };
  var css_248z$b$1 = ".comment[data-v-3d04e7dc]{display:flex;flex-direction:column;font-family:Roboto,Arial,sans-serif}.comment-body[data-v-3d04e7dc]{flex:1;padding:0 .25rem 0 2.625rem}.comment-editor.v-textarea[data-v-3d04e7dc]{margin:.75rem 0 0 0}.comment-editor.v-textarea[data-v-3d04e7dc]  .v-input__slot{width:auto}";
  styleInject(css_248z$b$1);
  /* script */

  var __vue_script__$f$1 = script$f$1;
  /* template */

  var __vue_render__$f$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "comment"
    }, [_c('comment-header', _vm._b({
      on: {
        "toggleEdit": _vm.toggleEdit,
        "remove": _vm.remove,
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', _vm.comment);
        }
      }
    }, 'comment-header', {
      comment: _vm.comment,
      isActivityThread: _vm.isActivityThread,
      isResolved: _vm.isResolved,
      elementLabel: _vm.elementLabel,
      user: _vm.user
    }, false)), _vm._v(" "), _c('div', {
      staticClass: "comment-body"
    }, [!_vm.isEditing ? _c('comment-preview', _vm._b({
      on: {
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', _vm.comment);
        }
      }
    }, 'comment-preview', {
      content: _vm.content,
      isResolved: _vm.isResolved
    }, false)) : [_c('v-textarea', {
      staticClass: "comment-editor",
      attrs: {
        "rows": "3",
        "autofocus": "",
        "outlined": "",
        "auto-grow": "",
        "clearable": "",
        "counter": ""
      },
      model: {
        value: _vm.content,
        callback: function callback($$v) {
          _vm.content = typeof $$v === 'string' ? $$v.trim() : $$v;
        },
        expression: "content"
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "d-flex justify-end"
    }, [_c('v-btn', {
      attrs: {
        "text": "",
        "small": ""
      },
      on: {
        "click": _vm.reset
      }
    }, [_vm._v("Cancel")]), _vm._v(" "), _c('v-btn', {
      attrs: {
        "color": "green",
        "text": "",
        "small": ""
      },
      on: {
        "click": _vm.save
      }
    }, [_c('v-icon', {
      staticClass: "pr-1"
    }, [_vm._v("mdi-check")]), _vm._v(" Save\n        ")], 1)], 1)]], 2)], 1);
  };

  var __vue_staticRenderFns__$f$1 = [];
  /* style */

  var __vue_inject_styles__$f$1 = undefined;
  /* scoped */

  var __vue_scope_id__$f$1 = "data-v-3d04e7dc";
  /* functional template */

  var __vue_is_functional_template__$f$1 = false;
  /* component normalizer */

  function __vue_normalize__$f$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ThreadComment$1 = __vue_normalize__$f$1({
    render: __vue_render__$f$1,
    staticRenderFns: __vue_staticRenderFns__$f$1
  }, __vue_inject_styles__$f$1, __vue_script__$f$1, __vue_scope_id__$f$1, __vue_is_functional_template__$f$1); //


  var script$e$1 = {
    name: 'thread-list',
    inject: ['$teRegistry'],
    props: {
      comments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    methods: {
      getElementLabel: function getElementLabel(_ref) {
        var _find;

        var contentElement = _ref.contentElement;
        if (!contentElement) return;
        return (_find = find__default['default'](this.$teRegistry._registry, {
          type: contentElement.type
        })) === null || _find === void 0 ? void 0 : _find.name;
      }
    },
    components: {
      ThreadComment: ThreadComment$1
    }
  };
  var css_248z$a$1 = ".thread-list[data-v-b5620cec]{margin:0;padding:0;list-style:none}.thread-list .thread-list-item .v-divider[data-v-b5620cec]{margin:0 .25rem 1rem .25rem}.thread-list .thread-list-item:first-child .v-divider[data-v-b5620cec]{display:none}";
  styleInject(css_248z$a$1);
  /* script */

  var __vue_script__$e$1 = script$e$1;
  /* template */

  var __vue_render__$e$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('ul', {
      staticClass: "thread-list"
    }, _vm._l(_vm.comments, function (comment) {
      return _c('li', {
        key: comment.uid,
        staticClass: "thread-list-item"
      }, [_c('v-divider'), _vm._v(" "), _c('thread-comment', _vm._g(_vm._b({
        staticClass: "mb-3",
        attrs: {
          "element-label": _vm.getElementLabel(comment)
        }
      }, 'thread-comment', {
        comment: comment,
        isActivityThread: _vm.isActivityThread,
        user: _vm.user
      }, false), _vm.$listeners))], 1);
    }), 0);
  };

  var __vue_staticRenderFns__$e$1 = [];
  /* style */

  var __vue_inject_styles__$e$1 = undefined;
  /* scoped */

  var __vue_scope_id__$e$1 = "data-v-b5620cec";
  /* functional template */

  var __vue_is_functional_template__$e$1 = false;
  /* component normalizer */

  function __vue_normalize__$e$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "List.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ThreadList$1 = __vue_normalize__$e$1({
    render: __vue_render__$e$1,
    staticRenderFns: __vue_staticRenderFns__$e$1
  }, __vue_inject_styles__$e$1, __vue_script__$e$1, __vue_scope_id__$e$1, __vue_is_functional_template__$e$1); //


  var script$d$1 = {
    name: 'unseen-divider',
    props: {
      count: {
        type: Number,
        required: true
      }
    },
    computed: {
      unseenCommentsLabel: function unseenCommentsLabel(_ref) {
        var count = _ref.count;
        return "".concat(count, " new ").concat(pluralize__default['default']('message', count));
      }
    }
  };
  var css_248z$9$1 = ".unseen-divider[data-v-221b9d72]{text-align:center}.unseen-divider .v-divider[data-v-221b9d72]{margin:1rem 0 .25rem}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip{margin:-1.5rem 0 .5rem 0;border-radius:1rem!important;background-color:#fafafa!important}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip .v-chip__content .v-chip__close{margin-top:.125rem;font-size:.75rem!important}";
  styleInject(css_248z$9$1);
  /* script */

  var __vue_script__$d$1 = script$d$1;
  /* template */

  var __vue_render__$d$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "unseen-divider"
    }, [_c('v-divider'), _vm._v(" "), _c('v-chip', {
      attrs: {
        "close-icon": "mdi-close",
        "color": "teal accent-4",
        "outlined": "",
        "small": "",
        "close": ""
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('seen');
        },
        "click:close": function clickClose($event) {
          return _vm.$emit('seen');
        }
      }
    }, [_c('v-icon', {
      staticClass: "mr-1",
      attrs: {
        "size": "14"
      }
    }, [_vm._v("mdi-arrow-down")]), _vm._v(" "), _c('span', {
      staticClass: "mr-2"
    }, [_vm._v(_vm._s(_vm.unseenCommentsLabel))])], 1)], 1);
  };

  var __vue_staticRenderFns__$d$1 = [];
  /* style */

  var __vue_inject_styles__$d$1 = undefined;
  /* scoped */

  var __vue_scope_id__$d$1 = "data-v-221b9d72";
  /* functional template */

  var __vue_is_functional_template__$d$1 = false;
  /* component normalizer */

  function __vue_normalize__$d$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "UnseenDivider.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var UnseenDivider$1 = __vue_normalize__$d$1({
    render: __vue_render__$d$1,
    staticRenderFns: __vue_staticRenderFns__$d$1
  }, __vue_inject_styles__$d$1, __vue_script__$d$1, __vue_scope_id__$d$1, __vue_is_functional_template__$d$1);

  var script$c$1 = {
    name: 'discussion-thread',
    props: {
      items: {
        type: Array,
        required: true
      },
      showAll: {
        type: Boolean,
        default: false
      },
      minDisplayed: {
        type: Number,
        default: 5
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      unseenCount: {
        type: Number,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        isVisible: false
      };
    },
    computed: {
      visibleComments: function visibleComments() {
        var items = this.items,
            minDisplayed = this.minDisplayed,
            showAll = this.showAll;
        var comments = showAll ? items : takeRgt__default['default'](items, minDisplayed);

        var _partition = partition__default['default'](comments, 'unseen'),
            _partition2 = _slicedToArray(_partition, 2),
            unseen = _partition2[0],
            seen = _partition2[1];

        return {
          seen: seen,
          unseen: unseen
        };
      }
    },
    methods: {
      onUpdate: function onUpdate(comment, content) {
        this.$emit('update', Object.assign({}, comment, {
          content: content
        }));
      },
      onIntersect: function onIntersect(_entries, _observer, isIntersected) {
        this.isVisible = isIntersected;
      },
      revealUnseen: function revealUnseen(count) {
        var $refs = this.$refs,
            minDisplayed = this.minDisplayed;
        if ((count || this.unseenCount) < minDisplayed) return;
        this.$emit('showAll', true);
        this.$nextTick(function () {
          var element = $refs.unseenDivider.$el;
          if (!element) return;
          element.scrollIntoView({
            behavior: 'smooth'
          });
        });
      },
      markSeen: function markSeen() {
        this.$emit('seen');
        this.$emit('showAll', false);
      }
    },
    watch: {
      isVisible: function isVisible(val) {
        if (!val || !this.unseenCount) return;
        this.revealUnseen();
      },
      unseenCount: {
        immediate: true,
        handler: 'revealUnseen'
      }
    },
    components: {
      UnseenDivider: UnseenDivider$1,
      ThreadList: ThreadList$1
    }
  };
  var css_248z$8$1 = ".discussion-thread[data-v-c6af8436]{width:100%}.discussion-thread.scroll-container[data-v-c6af8436]{max-height:31.25rem;overflow-y:scroll;overflow-x:hidden;padding-right:1.5rem;box-sizing:content-box}.discussion-thread .fade-enter-active[data-v-c6af8436],.discussion-thread .fade-leave-active[data-v-c6af8436]{transition:opacity .5s}.discussion-thread .fade-enter[data-v-c6af8436],.discussion-thread .fade-leave-to[data-v-c6af8436]{opacity:0}";
  styleInject(css_248z$8$1);
  /* script */

  var __vue_script__$c$1 = script$c$1;
  /* template */

  var __vue_render__$c$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      directives: [{
        name: "intersect",
        rawName: "v-intersect",
        value: _vm.onIntersect,
        expression: "onIntersect"
      }],
      staticClass: "discussion-thread",
      class: {
        'scroll-container': !_vm.isActivityThread
      }
    }, [_c('thread-list', _vm._b({
      on: {
        "update": _vm.onUpdate,
        "remove": function remove($event) {
          return _vm.$emit('remove', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        }
      }
    }, 'thread-list', {
      isActivityThread: _vm.isActivityThread,
      user: _vm.user,
      comments: _vm.visibleComments.seen
    }, false)), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_vm.unseenCount ? _c('unseen-divider', {
      ref: "unseenDivider",
      attrs: {
        "count": _vm.unseenCount
      },
      on: {
        "seen": _vm.markSeen
      }
    }) : _vm._e()], 1), _vm._v(" "), _c('thread-list', _vm._b({
      on: {
        "update": _vm.onUpdate,
        "remove": function remove($event) {
          return _vm.$emit('remove', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        }
      }
    }, 'thread-list', {
      isActivityThread: _vm.isActivityThread,
      user: _vm.user,
      comments: _vm.visibleComments.unseen
    }, false))], 1);
  };

  var __vue_staticRenderFns__$c$1 = [];
  /* style */

  var __vue_inject_styles__$c$1 = undefined;
  /* scoped */

  var __vue_scope_id__$c$1 = "data-v-c6af8436";
  /* functional template */

  var __vue_is_functional_template__$c$1 = false;
  /* component normalizer */

  function __vue_normalize__$c$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var DiscussionThread$1 = __vue_normalize__$c$1({
    render: __vue_render__$c$1,
    staticRenderFns: __vue_staticRenderFns__$c$1
  }, __vue_inject_styles__$c$1, __vue_script__$c$1, __vue_scope_id__$c$1, __vue_is_functional_template__$c$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$b$1 = {
    name: 'resolve-comments-btn'
  };
  /* script */

  var __vue_script__$b$1 = script$b$1;
  /* template */

  var __vue_render__$b$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "resolve-btn-container"
    }, [_c('v-tooltip', {
      attrs: {
        "open-delay": "800",
        "left": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('v-btn', _vm._g({
            staticClass: "px-1",
            attrs: {
              "color": "teal accent-4",
              "small": "",
              "text": ""
            }
          }, Object.assign({}, _vm.$listeners, on)), [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "size": "24",
              "color": "teal accent-4"
            }
          }, [_vm._v("\n          mdi-check-box-outline\n        ")]), _vm._v("\n        Resolve All\n      ")], 1)];
        }
      }])
    }, [_vm._v(" "), _c('span', [_vm._v("Mark all as resolved and hide discussion")])])], 1);
  };

  var __vue_staticRenderFns__$b$1 = [];
  /* style */

  var __vue_inject_styles__$b$1 = undefined;
  /* scoped */

  var __vue_scope_id__$b$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$b$1 = false;
  /* component normalizer */

  function __vue_normalize__$b$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ResolveButton.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ResolveButton$1 = __vue_normalize__$b$1({
    render: __vue_render__$b$1,
    staticRenderFns: __vue_staticRenderFns__$b$1
  }, __vue_inject_styles__$b$1, __vue_script__$b$1, __vue_scope_id__$b$1, __vue_is_functional_template__$b$1); //


  var initCommentInput$1 = function initCommentInput() {
    return {
      content: ''
    };
  };

  var script$a$1 = {
    name: 'tailor-embedded-discussion',
    inheritAttrs: true,
    props: {
      comments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      unseenComments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      commentsShownLimit: {
        type: Number,
        default: 5
      },
      scrollTarget: {
        type: String,
        default: 'discussion'
      },
      showHeading: {
        type: Boolean,
        default: false
      },
      showNotifications: {
        type: Boolean,
        default: false
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      hasUnresolvedComments: {
        type: Boolean,
        default: false
      },
      isVisible: {
        type: Boolean,
        default: false
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        showAll: false,
        comment: initCommentInput$1()
      };
    },
    computed: {
      thread: function thread() {
        var comments = this.comments,
            unseenComments = this.unseenComments;
        var processedThread = comments.map(function (comment) {
          var unseen = unseenComments.find(function (it) {
            return it.id === comment.id;
          });
          return Object.assign({}, comment, {
            unseen: !!unseen
          });
        });
        return orderBy__default['default'](processedThread, ['unseen', 'createdAt'], 'asc');
      },
      commentsCount: function commentsCount(vm) {
        return vm.thread.length;
      },
      hasHiddenComments: function hasHiddenComments(vm) {
        return vm.commentsShownLimit < vm.commentsCount;
      },
      isTextEditorEmpty: function isTextEditorEmpty(vm) {
        var _vm$comment$content;

        return !((_vm$comment$content = vm.comment.content) !== null && _vm$comment$content !== void 0 && _vm$comment$content.trim());
      },
      discussion: function discussion(vm) {
        return vm.$refs.discussion;
      },
      commentInput: function commentInput(vm) {
        return vm.$refs.commentInput;
      },
      showResolveButton: function showResolveButton(vm) {
        return vm.hasUnresolvedComments && !vm.isActivityThread;
      }
    },
    methods: Object.assign({}, vueRadio.mapRequests('app', ['showConfirmationModal']), {
      post: function post() {
        var _this = this;

        var scrollTarget = this.scrollTarget,
            comment = this.comment,
            author = this.user;
        if (!comment.content) return;
        var payload = {
          content: comment.content,
          author: author,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        this.comment = initCommentInput$1();
        this.$emit('save', payload); // Keep editor/discussion container inside viewport.

        var scrollOptions = {
          block: 'center',
          behavior: 'smooth'
        };
        this.$nextTick(function () {
          return _this[scrollTarget].scrollIntoView(scrollOptions);
        });
      },
      remove: function remove(comment) {
        var _this2 = this;

        this.showConfirmationModal(Object.assign({
          title: 'Remove comment',
          message: 'Are you sure you want to remove this comment?',
          action: function action() {
            return _this2.$emit('remove', comment);
          }
        }, this.onConfirmationActive()));
      },
      resolveAll: function resolveAll() {
        var _this3 = this;

        this.showConfirmationModal(Object.assign({
          title: 'Resolve all comments',
          message: 'Are you sure you want to resolve all comments?',
          action: function action() {
            return _this3.$emit('resolve');
          }
        }, this.onConfirmationActive()));
      },
      onConfirmationActive: function onConfirmationActive() {
        var _this4 = this;

        var onOpen = function onOpen() {
          return _this4.$emit('update:confirmationActive', true);
        };

        var onClose = function onClose() {
          return _this4.$emit('update:confirmationActive', false);
        };

        return {
          onOpen: onOpen,
          onClose: onClose
        };
      }
    }),
    watch: {
      commentsCount: function commentsCount() {
        this.$emit('change', this.thread);
      },
      isVisible: {
        immediate: true,
        handler: function handler(val) {
          var _this5 = this;

          if (!val && this.isActivityThread) return; // Focus editor manually with delay to avoid
          // element focus prioritization (e.g HTML element)

          setTimeout(function () {
            return _this5.commentInput.focus();
          }, 500);
        }
      }
    },
    created: function created() {
      this.comment = initCommentInput$1();
    },
    components: {
      DiscussionThread: DiscussionThread$1,
      ResolveButton: ResolveButton$1
    }
  };
  var css_248z$7$1 = ".embedded-discussion[data-v-8b85896c]{font-family:Roboto,Arial,sans-serif}.embedded-discussion .resolve-btn-container[data-v-8b85896c]{display:flex;justify-content:flex-end;margin:.5rem 0 0 0}.embedded-discussion .header[data-v-8b85896c]{margin:.875rem 0 1.625rem 0;font-size:1.125rem;font-weight:400}.embedded-discussion .comment-input[data-v-8b85896c]{margin:0 .25rem 0 .25rem}.embedded-discussion .alert[data-v-8b85896c]  .v-icon{color:var(--v-primary-darken2)!important}";
  styleInject(css_248z$7$1);
  /* script */

  var __vue_script__$a$1 = script$a$1;
  /* template */

  var __vue_render__$a$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      ref: "discussion",
      staticClass: "embedded-discussion"
    }, [_vm.showResolveButton ? _c('resolve-button', {
      on: {
        "click": _vm.resolveAll
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      class: {
        'pb-7': !_vm.showHeading && _vm.hasHiddenComments
      }
    }, [_vm.hasHiddenComments ? _c('v-btn', {
      staticClass: "float-right mt-1",
      attrs: {
        "text": "",
        "x-small": ""
      },
      on: {
        "click": function click($event) {
          _vm.showAll = !_vm.showAll;
        }
      }
    }, [_vm._v("\n      Show " + _vm._s(_vm.showAll ? 'less' : 'more') + "\n    ")]) : _vm._e()], 1), _vm._v(" "), _vm.showHeading ? _c('div', {
      staticClass: "header d-flex grey--text text--darken-3"
    }, [_c('v-icon', {
      staticClass: "mr-2",
      attrs: {
        "color": "grey darken-3"
      }
    }, [_vm._v("\n      mdi-forum-outline\n    ")]), _vm._v("\n    Comments\n  ")], 1) : _vm._e(), _vm._v(" "), !_vm.commentsCount && _vm.showNotifications ? _c('v-alert', {
      staticClass: "alert",
      attrs: {
        "color": "primary lighten-5",
        "icon": "mdi-keyboard-outline",
        "prominent": ""
      }
    }, [_c('span', {
      staticClass: "px-1 subtitle-2"
    }, [_vm._v("\n      Be the First to Comment!\n    ")])]) : _vm._e(), _vm._v(" "), _vm.thread.length ? _c('discussion-thread', {
      staticClass: "mt-2",
      attrs: {
        "items": _vm.thread,
        "show-all": _vm.showAll,
        "min-displayed": _vm.commentsShownLimit,
        "is-activity-thread": _vm.isActivityThread,
        "unseen-count": _vm.unseenComments.length,
        "user": _vm.user
      },
      on: {
        "update": function update($event) {
          return _vm.$emit('update', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        },
        "seen": function seen($event) {
          return _vm.$emit('seen');
        },
        "remove": _vm.remove,
        "showAll": function showAll($event) {
          _vm.showAll = $event;
        }
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "text-right"
    }, [_c('v-textarea', {
      ref: "commentInput",
      staticClass: "comment-input",
      attrs: {
        "placeholder": _vm.commentsCount ? 'Add a comment...' : 'Start the discussion...',
        "rows": "3",
        "outlined": "",
        "auto-grow": "",
        "clearable": "",
        "counter": ""
      },
      on: {
        "focus": function focus($event) {
          return _vm.$emit('seen');
        }
      },
      model: {
        value: _vm.comment.content,
        callback: function callback($$v) {
          _vm.$set(_vm.comment, "content", typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "comment.content"
      }
    }), _vm._v(" "), _c('v-btn', {
      attrs: {
        "disabled": _vm.isTextEditorEmpty,
        "icon": ""
      },
      on: {
        "click": _vm.post
      }
    }, [_c('v-icon', [_vm._v("mdi-send")])], 1)], 1)], 1);
  };

  var __vue_staticRenderFns__$a$1 = [];
  /* style */

  var __vue_inject_styles__$a$1 = undefined;
  /* scoped */

  var __vue_scope_id__$a$1 = "data-v-8b85896c";
  /* functional template */

  var __vue_is_functional_template__$a$1 = false;
  /* component normalizer */

  function __vue_normalize__$a$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var Discussion$1$1 = __vue_normalize__$a$1({
    render: __vue_render__$a$1,
    staticRenderFns: __vue_staticRenderFns__$a$1
  }, __vue_inject_styles__$a$1, __vue_script__$a$1, __vue_scope_id__$a$1, __vue_is_functional_template__$a$1); //


  var getActivatorOptions$1 = function getActivatorOptions(unseenComments) {
    return {
      unseen: {
        class: 'teal accent-4 white--text',
        tooltip: 'View new comments',
        text: unseenComments.length
      },
      preview: {
        icon: 'mdi-comment-text-multiple-outline',
        color: 'primary darken-4',
        tooltip: 'View comments'
      },
      post: {
        icon: 'mdi-message-plus-outline',
        color: 'primary darken-4',
        tooltip: 'Post a comment'
      }
    };
  };

  var script$9$1 = {
    name: 'tailor-element-discussion',
    props: {
      id: {
        type: Number,
        default: null
      },
      uid: {
        type: String,
        required: true
      },
      comments: {
        type: Array,
        required: true
      },
      hasUnresolvedComments: {
        type: Boolean,
        default: false
      },
      lastSeen: {
        type: Number,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        isVisible: false,
        isConfirmationActive: false
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorBus: 'editor'
    }), {
      events: function events() {
        return utils.Events.Discussion;
      },
      lastCommentAt: function lastCommentAt(vm) {
        return new Date(get__default['default'](vm.comments[0], 'createdAt', 0)).getTime();
      },
      unseenComments: function unseenComments() {
        var comments = this.comments,
            user = this.user,
            lastSeen = this.lastSeen;
        return comments.filter(function (it) {
          var createdAt = new Date(it.createdAt).getTime();
          return it.author.id !== user.id && createdAt > lastSeen;
        });
      },
      activator: function activator() {
        var comments = this.comments,
            unseenComments = this.unseenComments;
        var type = unseenComments.length ? 'unseen' : comments.length ? 'preview' : 'post';
        return getActivatorOptions$1(unseenComments)[type];
      }
    }),
    methods: {
      save: function save(data) {
        var author = this.user,
            elementId = this.id,
            hasUnresolvedComments = this.hasUnresolvedComments;
        return this.editorBus.emit(utils.Events.Discussion.SAVE, Object.assign({}, data, {
          author: author,
          contentElementId: elementId,
          hasUnresolvedComments: hasUnresolvedComments
        }));
      },
      setLastSeen: function setLastSeen(timeout) {
        var elementUid = this.uid,
            lastCommentAt = this.lastCommentAt,
            events = this.events;
        var options = {
          elementUid: elementUid,
          lastCommentAt: lastCommentAt,
          timeout: timeout
        };
        this.editorBus.emit(events.SET_LAST_SEEN, options);
      },
      resolve: function resolve() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            id = _ref.id,
            resolvedAt = _ref.resolvedAt;

        var contentElementId = this.id,
            events = this.events;
        this.editorBus.emit(events.RESOLVE, {
          id: id,
          contentElementId: contentElementId,
          resolvedAt: resolvedAt
        });
      }
    },
    watch: {
      isVisible: function isVisible(val) {
        this.$emit(val ? 'open' : 'close');
      }
    },
    components: {
      Discussion: Discussion$1$1
    }
  };
  var css_248z$6$1 = "[data-v-7be6d374] .v-menu__content{background:#fff}[data-v-7be6d374] .v-menu__content .embedded-discussion{text-align:left}[data-v-7be6d374] .v-menu__content .comment .author{font-size:.875rem}.unseen[data-v-7be6d374]{font-size:.75rem}";
  styleInject(css_248z$6$1);
  /* script */

  var __vue_script__$9$1 = script$9$1;
  /* template */

  var __vue_render__$9$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-menu', {
      attrs: {
        "close-on-content-click": false,
        "close-on-click": !_vm.isConfirmationActive,
        "min-width": "300",
        "transition": "slide-y-transition",
        "left": "",
        "offset-y": "",
        "attach": ""
      },
      nativeOn: {
        "click": function click($event) {
          $event.stopPropagation();
        }
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var menu = ref.on;
          return [_c('v-tooltip', {
            attrs: {
              "open-delay": "800",
              "left": ""
            },
            scopedSlots: _vm._u([{
              key: "activator",
              fn: function fn(ref) {
                var tooltip = ref.on;
                return [_c('v-btn', _vm._g({
                  class: _vm.activator.class,
                  attrs: {
                    "x-small": "",
                    "icon": ""
                  }
                }, Object.assign({}, menu, tooltip)), [_vm.activator.text ? _c('div', {
                  staticClass: "unseen"
                }, [_vm._v(_vm._s(_vm.activator.text))]) : _c('v-icon', {
                  attrs: {
                    "color": _vm.activator.color,
                    "size": "18"
                  }
                }, [_vm._v("\n            " + _vm._s(_vm.activator.icon) + "\n          ")])], 1)];
              }
            }], null, true)
          }, [_vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.activator.tooltip))])])];
        }
      }]),
      model: {
        value: _vm.isVisible,
        callback: function callback($$v) {
          _vm.isVisible = $$v;
        },
        expression: "isVisible"
      }
    }, [_vm._v(" "), _c('discussion', _vm._b({
      staticClass: "pa-2",
      attrs: {
        "confirmation-active": _vm.isConfirmationActive
      },
      on: {
        "save": _vm.save,
        "update": _vm.save,
        "remove": function remove($event) {
          return _vm.editorBus.emit(_vm.events.REMOVE, $event);
        },
        "seen": _vm.setLastSeen,
        "resolve": _vm.resolve,
        "update:confirmationActive": function updateConfirmationActive($event) {
          _vm.isConfirmationActive = $event;
        },
        "update:confirmation-active": function updateConfirmationActive($event) {
          _vm.isConfirmationActive = $event;
        }
      }
    }, 'discussion', {
      comments: _vm.comments,
      unseenComments: _vm.unseenComments,
      hasUnresolvedComments: _vm.hasUnresolvedComments,
      user: _vm.user,
      isVisible: _vm.isVisible
    }, false))], 1);
  };

  var __vue_staticRenderFns__$9$1 = [];
  /* style */

  var __vue_inject_styles__$9$1 = undefined;
  /* scoped */

  var __vue_scope_id__$9$1 = "data-v-7be6d374";
  /* functional template */

  var __vue_is_functional_template__$9$1 = false;
  /* component normalizer */

  function __vue_normalize__$9$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementDiscussion.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var Discussion$2 = __vue_normalize__$9$1({
    render: __vue_render__$9$1,
    staticRenderFns: __vue_staticRenderFns__$9$1
  }, __vue_inject_styles__$9$1, __vue_script__$9$1, __vue_scope_id__$9$1, __vue_is_functional_template__$9$1); //


  var script$8$1 = {
    name: 'tailor-publish-diff-chip',
    props: {
      changeType: {
        validator: function validator(value) {
          if (!value) return true;
          return Object.values(utils.publishDiffChangeTypes).includes(value);
        },
        default: null
      }
    }
  };
  /* script */

  var __vue_script__$8$1 = script$8$1;
  /* template */

  var __vue_render__$8$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _vm.changeType ? _c('v-chip', {
      staticClass: "readonly font-weight-medium text-capitalize",
      attrs: {
        "text-color": _vm.changeType === 'new' ? 'success' : 'secondary',
        "color": "primary lighten-5",
        "small": "",
        "round": ""
      }
    }, [_vm._v("\n  " + _vm._s(_vm.changeType) + "\n")]) : _vm._e();
  };

  var __vue_staticRenderFns__$8$1 = [];
  /* style */

  var __vue_inject_styles__$8$1 = undefined;
  /* scoped */

  var __vue_scope_id__$8$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$8$1 = false;
  /* component normalizer */

  function __vue_normalize__$8$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "PublishDiffChip.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var PublishDiffChip$1 = __vue_normalize__$8$1({
    render: __vue_render__$8$1,
    staticRenderFns: __vue_staticRenderFns__$8$1
  }, __vue_inject_styles__$8$1, __vue_script__$8$1, __vue_scope_id__$8$1, __vue_is_functional_template__$8$1); //


  var script$7$1 = {
    name: 'tailor-content-element',
    inject: {
      $getCurrentUser: {},
      $editorState: {
        default: {}
      }
    },
    inheritAttrs: false,
    props: {
      element: {
        type: Object,
        required: true
      },
      parent: {
        type: Object,
        default: null
      },
      isHovered: {
        type: Boolean,
        default: false
      },
      isDragged: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      frame: {
        type: Boolean,
        default: true
      },
      dense: {
        type: Boolean,
        default: false
      },
      showDiscussion: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        isFocused: false,
        isSaving: false,
        activeUsers: []
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorBus: 'editor'
    }), {
      id: function id(vm) {
        return utils.getElementId(vm.element);
      },
      componentName: function componentName(vm) {
        return utils.getComponentName(vm.element.type);
      },
      isEmbed: function isEmbed(vm) {
        return !!vm.parent || !vm.element.uid;
      },
      isHighlighted: function isHighlighted(vm) {
        return vm.isFocused || vm.isHovered;
      },
      hasComments: function hasComments(vm) {
        var _vm$element$comments;

        return !!((_vm$element$comments = vm.element.comments) !== null && _vm$element$comments !== void 0 && _vm$element$comments.length);
      },
      elementBus: function elementBus(vm) {
        return vm.$radio.channel("element:".concat(vm.id));
      },
      currentUser: function currentUser(vm) {
        return vm.$getCurrentUser();
      }
    }),
    methods: {
      onSelect: function onSelect(e) {
        if (this.isDisabled || this.$editorState.isPublishDiff || e.component) return;
        this.focus();
        e.component = {
          name: 'content-element',
          data: this.element
        };
      },
      onSave: function onSave(data) {
        if (!this.isEmbed) this.isSaving = true;
        this.$emit('save', data);
      },
      focus: function focus() {
        this.editorBus.emit('element:focus', this.element, this.parent);
      }
    },
    created: function created() {
      var _this = this;

      var deferSaveFlag = function deferSaveFlag() {
        return setTimeout(function () {
          return _this.isSaving = false;
        }, 1000);
      }; // Element listeners


      this.elementBus.on('delete', function () {
        return _this.$emit('delete');
      });
      this.elementBus.on('save:meta', function (meta) {
        return _this.$emit('save:meta', meta);
      });
      this.elementBus.on('saved', deferSaveFlag); // Editor listeners

      this.editorBus.on('element:select', function (_ref) {
        var elementId = _ref.elementId,
            _ref$isSelected = _ref.isSelected,
            isSelected = _ref$isSelected === void 0 ? true : _ref$isSelected,
            user = _ref.user;
        if (_this.id !== elementId) return; // If current user; focus element

        if (!user || user.id === _this.currentUser.id) {
          _this.isFocused = isSelected;
          if (isSelected) _this.focus();
          return;
        } // If other user, toggle within active users list


        if (isSelected && !_this.activeUsers.find(function (it) {
          return it.id === user.id;
        })) {
          _this.activeUsers.push(user);
        } else if (!isSelected && _this.activeUsers.find(function (it) {
          return it.id === user.id;
        })) {
          _this.activeUsers = _this.activeUsers.filter(function (it) {
            return it.id !== user.id;
          });
        }
      });
      this.editorBus.on('element:focus', function (element) {
        _this.isFocused = !!element && utils.getElementId(element) === _this.id;
      });
    },
    provide: function provide() {
      return {
        $elementBus: this.elementBus
      };
    },
    components: {
      ActiveUsers: ActiveUsers,
      Discussion: Discussion$2,
      PublishDiffChip: PublishDiffChip$1
    }
  };
  var css_248z$5$1 = ".content-element[data-v-56cb794a]{position:relative;border:1px solid transparent}.content-element[data-v-56cb794a]::after{content:'';display:none;position:absolute;top:0;right:-.125rem;width:.125rem;height:100%}.content-element.focused[data-v-56cb794a]{border:1px dashed #1de9b6}.content-element.focused[data-v-56cb794a]::after{display:block;background:#1de9b6}.content-element.selected[data-v-56cb794a]{border:1px dashed #ff4081}.content-element.selected[data-v-56cb794a]::after{display:block;background:#ff4081}.frame[data-v-56cb794a]{padding:10px 20px;border:1px solid #e1e1e1}.element-actions[data-v-56cb794a]{display:flex;flex-direction:column;position:absolute;top:-.0625rem;right:-1.25rem;width:1.5rem;height:100%;padding-left:.75rem}.element-actions>*[data-v-56cb794a]{min-height:1.75rem;opacity:0;transition:opacity .1s linear}.element-actions>.is-visible[data-v-56cb794a]{opacity:1;transition:opacity .5s linear}.active-users[data-v-56cb794a]{position:absolute;top:0;left:-1.625rem}.save-indicator[data-v-56cb794a]{position:absolute;bottom:-.125rem;left:0}.header[data-v-56cb794a]{width:100%;max-height:0}.header.visible[data-v-56cb794a]{max-height:unset;padding:0 0 .5rem}.diff.new[data-v-56cb794a]{border:none;box-shadow:0 0 0 2px var(--v-success-lighten2)!important}.diff.changed[data-v-56cb794a],.diff.removed[data-v-56cb794a]{border:none;box-shadow:0 0 0 2px var(--v-secondary-lighten4)!important}.diff .element-actions[data-v-56cb794a]{display:none}";
  styleInject(css_248z$5$1);
  /* script */

  var __vue_script__$7$1 = script$7$1;
  /* template */

  var __vue_render__$7$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content-element",
      class: [_vm.element.changeSincePublish, {
        selected: _vm.activeUsers.length,
        focused: _vm.isFocused,
        diff: _vm.$editorState.isPublishDiff,
        frame: _vm.frame
      }],
      on: {
        "click": _vm.onSelect
      }
    }, [_c('div', {
      staticClass: "header d-flex",
      class: {
        visible: _vm.$editorState.isPublishDiff && _vm.element.changeSincePublish
      }
    }, [_c('publish-diff-chip', {
      staticClass: "ml-auto ",
      attrs: {
        "change-type": _vm.element.changeSincePublish
      }
    })], 1), _vm._v(" "), _c('active-users', {
      staticClass: "active-users",
      attrs: {
        "users": _vm.activeUsers,
        "size": 20
      }
    }), _vm._v(" "), _c(_vm.componentName, _vm._b({
      tag: "component",
      attrs: {
        "id": "element_" + _vm.id
      },
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        },
        "save": _vm.onSave,
        "delete": function _delete($event) {
          return _vm.$emit('delete');
        },
        "focus": _vm.onSelect
      }
    }, 'component', Object.assign({}, _vm.$attrs, {
      element: _vm.element,
      isFocused: _vm.isFocused,
      isDragged: _vm.isDragged,
      isDisabled: _vm.isDisabled,
      dense: _vm.dense
    }), false)), _vm._v(" "), !_vm.isDisabled ? _c('div', {
      staticClass: "element-actions"
    }, [_vm.showDiscussion ? _c('div', {
      class: {
        'is-visible': _vm.isHighlighted || _vm.hasComments
      }
    }, [_c('discussion', _vm._b({
      attrs: {
        "user": _vm.currentUser
      },
      on: {
        "open": _vm.focus,
        "close": function close($event) {
          _vm.isFocused = false;
        }
      }
    }, 'discussion', _vm.element, false))], 1) : _vm._e(), _vm._v(" "), !_vm.parent ? _c('div', {
      class: {
        'is-visible': _vm.isHighlighted
      }
    }, [_c('v-btn', {
      attrs: {
        "color": "pink lighten-1",
        "dark": "",
        "icon": "",
        "x-small": ""
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('delete');
        }
      }
    }, [_c('v-icon', {
      attrs: {
        "size": "20"
      }
    }, [_vm._v("mdi-delete-outline")])], 1)], 1) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.isSaving ? _c('v-progress-linear', {
      staticClass: "save-indicator",
      attrs: {
        "height": "2",
        "color": "teal accent-2",
        "indeterminate": ""
      }
    }) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$7$1 = [];
  /* style */

  var __vue_inject_styles__$7$1 = undefined;
  /* scoped */

  var __vue_scope_id__$7$1 = "data-v-56cb794a";
  /* functional template */

  var __vue_is_functional_template__$7$1 = false;
  /* component normalizer */

  function __vue_normalize__$7$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ContentElement.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentElement$2 = __vue_normalize__$7$1({
    render: __vue_render__$7$1,
    staticRenderFns: __vue_staticRenderFns__$7$1
  }, __vue_inject_styles__$7$1, __vue_script__$7$1, __vue_scope_id__$7$1, __vue_is_functional_template__$7$1); //


  var script$6$1 = {
    name: 'tailor-contained-content',
    inheritAttrs: false,
    props: {
      element: {
        type: Object,
        required: true
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isDragged: {
        type: Boolean,
        default: false
      },
      setWidth: {
        type: Boolean,
        default: true
      },
      dense: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        isHovered: false
      };
    },
    computed: {
      bindings: function bindings() {
        var element = this.element,
            isDisabled = this.isDisabled,
            isDragged = this.isDragged,
            isHovered = this.isHovered,
            dense = this.dense,
            attrs = this.$attrs;
        return Object.assign({
          element: element,
          isDisabled: isDisabled,
          isDragged: isDragged,
          isHovered: isHovered,
          dense: dense
        }, attrs);
      },
      widthClass: function widthClass() {
        var element = this.element,
            setWidth = this.setWidth;
        return setWidth ? "col-xs-".concat(get__default['default'](element, 'data.width', 12)) : '';
      }
    },
    methods: {
      scrollContainer: throttle__default['default'](function (e) {
        var scrollUp = e.y < 200;
        var scrollDown = e.y > window.innerHeight - 200;
        if (scrollUp || scrollDown) window.scrollBy(0, scrollUp ? -30 : 30);
      }, 20)
    },
    components: {
      ContentElement: ContentElement$2
    }
  };
  var css_248z$4$1 = ".drag-handle[data-v-cb586726]{position:absolute;left:-3px;z-index:2;width:26px;opacity:0}.drag-handle .mdi[data-v-cb586726]{color:#888;font-size:28px}.hovered .drag-handle[data-v-cb586726]{opacity:1;transition:opacity .6s ease-in-out;cursor:pointer}.disabled .drag-handle[data-v-cb586726]{display:none}.contained-content[data-v-cb586726]{position:relative;margin:7px 0;padding:0}";
  styleInject(css_248z$4$1);
  /* script */

  var __vue_script__$6$1 = script$6$1;
  /* template */

  var __vue_render__$6$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "contained-content",
      class: [_vm.widthClass, {
        disabled: _vm.isDisabled,
        hovered: _vm.isHovered
      }],
      on: {
        "mouseover": function mouseover($event) {
          _vm.isHovered = true;
        },
        "mouseleave": function mouseleave($event) {
          _vm.isHovered = false;
        },
        "dragstart": function dragstart($event) {
          return _vm.$emit('dragstart');
        },
        "dragend": function dragend($event) {
          return _vm.$emit('dragend');
        },
        "dragover": _vm.scrollContainer
      }
    }, [!_vm.isDisabled ? _c('span', {
      staticClass: "drag-handle"
    }, [_c('span', {
      staticClass: "mdi mdi-drag-vertical"
    })]) : _vm._e(), _vm._v(" "), _c('content-element', _vm._b({
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        },
        "save": function save($event) {
          return _vm.$emit('save', $event);
        },
        "save:meta": function saveMeta($event) {
          return _vm.$emit('save:meta', $event);
        },
        "delete": function _delete($event) {
          return _vm.$emit('delete');
        }
      }
    }, 'content-element', _vm.bindings, false))], 1);
  };

  var __vue_staticRenderFns__$6$1 = [];
  /* style */

  var __vue_inject_styles__$6$1 = undefined;
  /* scoped */

  var __vue_scope_id__$6$1 = "data-v-cb586726";
  /* functional template */

  var __vue_is_functional_template__$6$1 = false;
  /* component normalizer */

  function __vue_normalize__$6$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ContainedContent.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContainedContent$1 = __vue_normalize__$6$1({
    render: __vue_render__$6$1,
    staticRenderFns: __vue_staticRenderFns__$6$1
  }, __vue_inject_styles__$6$1, __vue_script__$6$1, __vue_scope_id__$6$1, __vue_is_functional_template__$6$1); //


  var CE_FOCUS_EVENT$1 = 'element:focus';
  var script$5$1 = {
    name: 'tailor-element-list',
    props: {
      elements: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      dragOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      supportedTypes: {
        type: Array,
        default: null
      },
      activity: {
        type: Object,
        default: null
      },
      layout: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      enableAdd: {
        type: Boolean,
        default: true
      },
      addElementOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    data: function data() {
      return {
        dragElementIndex: null
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorChannel: 'editor'
    }), {
      options: function options(vm) {
        return Object.assign({}, vm.dragOptions, {
          handle: '.drag-handle'
        });
      }
    }),
    methods: {
      get: get__default['default'],
      getElementId: utils.getElementId,
      onDragStart: function onDragStart(index) {
        this.dragElementIndex = index;
        this.editorChannel.emit(CE_FOCUS_EVENT$1);
      },
      onDragEnd: function onDragEnd(element) {
        this.dragElementIndex = -1;
        this.editorChannel.emit(CE_FOCUS_EVENT$1, element);
      },
      reorder: function reorder(_ref) {
        var newPosition = _ref.newIndex;
        var items = this.elements;
        this.$emit('update', {
          newPosition: newPosition,
          items: items
        });
      }
    },
    components: {
      AddElement: AddElement$1,
      Draggable: Draggable__default['default']
    }
  };
  var css_248z$3$1 = ".list-group[data-v-f18f3e56]{padding:.625rem 1.5rem}[data-v-f18f3e56] .sortable-ghost .drag-handle{display:none}[data-v-f18f3e56] .sortable-ghost .content-element{max-height:9.375rem;background:#f4f5f5}[data-v-f18f3e56] .sortable-ghost .content-element>*{visibility:hidden}[data-v-f18f3e56] .sortable-drag .content-element{max-height:auto;background:#fff}";
  styleInject(css_248z$3$1);
  /* script */

  var __vue_script__$5$1 = script$5$1;
  /* template */

  var __vue_render__$5$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "list-group"
    }, [_c('draggable', _vm._b({
      staticClass: "row",
      attrs: {
        "list": _vm.elements,
        "disabled": _vm.isDisabled
      },
      on: {
        "start": function start($event) {
          _vm.dragElementIndex = $event.oldIndex;
        },
        "end": function end($event) {
          _vm.dragElementIndex = -1;
        },
        "update": _vm.reorder
      }
    }, 'draggable', _vm.options, false), _vm._l(_vm.elements, function (element, index) {
      return _c('div', {
        key: _vm.getElementId(element),
        staticClass: "pr-5",
        class: "col-xs-" + _vm.get(element, 'data.width', 12),
        on: {
          "dragstart": function dragstart($event) {
            return _vm.onDragStart(index);
          },
          "dragend": function dragend($event) {
            return _vm.onDragEnd(element);
          }
        }
      }, [_vm._t("list-item", null, {
        "element": element,
        "isDragged": _vm.dragElementIndex === index,
        "position": index
      })], 2);
    }), 0), _vm._v(" "), _vm.enableAdd && !_vm.isDisabled ? [_vm._t("list-add", [_c('add-element', {
      staticClass: "mt-1",
      attrs: {
        "items": _vm.elements,
        "include": _vm.supportedTypes,
        "activity": _vm.activity,
        "label": _vm.addElementOptions.label,
        "large": _vm.addElementOptions.large,
        "position": _vm.elements.length,
        "layout": _vm.layout
      },
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        }
      }
    })], {
      "include": _vm.supportedTypes,
      "activity": _vm.activity,
      "position": _vm.elements.length,
      "layout": _vm.layout
    })] : _vm._e()], 2);
  };

  var __vue_staticRenderFns__$5$1 = [];
  /* style */

  var __vue_inject_styles__$5$1 = undefined;
  /* scoped */

  var __vue_scope_id__$5$1 = "data-v-f18f3e56";
  /* functional template */

  var __vue_is_functional_template__$5$1 = false;
  /* component normalizer */

  function __vue_normalize__$5$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementList.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ElementList$1 = __vue_normalize__$5$1({
    render: __vue_render__$5$1,
    staticRenderFns: __vue_staticRenderFns__$5$1
  }, __vue_inject_styles__$5$1, __vue_script__$5$1, __vue_scope_id__$5$1, __vue_is_functional_template__$5$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$4$1 = {
    name: 'tailor-element-placeholder',
    props: {
      name: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        default: 'Select to edit'
      },
      activePlaceholder: {
        type: String,
        default: 'Use toolbar to edit'
      },
      activeIcon: {
        type: String,
        default: null
      },
      activeColor: {
        type: String,
        default: '#fff'
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isFocused: {
        type: Boolean,
        default: false
      },
      dense: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      iconSize: function iconSize() {
        if (this.dense) return this.isFocused ? 24 : 20;
        return this.isFocused ? 38 : 30;
      }
    }
  };
  /* script */

  var __vue_script__$4$1 = script$4$1;
  /* template */

  var __vue_render__$4$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-sheet', {
      staticClass: "transparent grey--text text--darken-4",
      class: _vm.dense ? 'pt-3' : 'pa-12'
    }, [_c('v-avatar', {
      attrs: {
        "size": _vm.dense ? 40 : 60,
        "color": _vm.isDisabled ? 'grey darken-3' : 'primary darken-4'
      }
    }, [_c('v-icon', {
      attrs: {
        "size": _vm.iconSize,
        "color": _vm.isFocused ? _vm.activeColor : '#fff'
      }
    }, [_vm._v("\n      " + _vm._s(_vm.icon) + "\n    ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "grey--text",
      class: [_vm.isDisabled ? 'text--darken-3' : 'text--darken-4', _vm.dense ? 'my-2 subtitle-2' : 'my-4 headline']
    }, [_vm._v("\n    " + _vm._s(_vm.name) + "\n  ")]), _vm._v(" "), !_vm.dense && !_vm.isDisabled ? _c('div', {
      staticClass: "subtitle-1"
    }, [!_vm.isFocused ? [_vm._v(_vm._s(_vm.placeholder))] : [_c('span', [_vm._v(_vm._s(_vm.activePlaceholder))]), _vm._v(" "), _vm.activeIcon ? _c('v-icon', {
      attrs: {
        "size": "20",
        "color": "primary darken-4"
      }
    }, [_vm._v("\n        " + _vm._s(_vm.activeIcon) + "\n      ")]) : _vm._e()]], 2) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$4$1 = [];
  /* style */

  var __vue_inject_styles__$4$1 = undefined;
  /* scoped */

  var __vue_scope_id__$4$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$4$1 = false;
  /* component normalizer */

  function __vue_normalize__$4$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementPlaceholder.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  __vue_normalize__$4$1({
    render: __vue_render__$4$1,
    staticRenderFns: __vue_staticRenderFns__$4$1
  }, __vue_inject_styles__$4$1, __vue_script__$4$1, __vue_scope_id__$4$1, __vue_is_functional_template__$4$1);

  var script$3$1 = {
    name: 'tailor-embedded-container',
    inheritAttrs: false,
    props: {
      container: {
        type: Object,
        required: true
      },
      types: {
        type: Array,
        default: function _default() {
          return ['JODIT_HTML', 'IMAGE', 'HTML', 'VIDEO'];
        }
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      addElementOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      enableAdd: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      embeds: function embeds() {
        var items = this.container.embeds;
        return items ? values__default['default'](items).sort(function (a, b) {
          return a.position - b.position;
        }) : [];
      }
    },
    methods: Object.assign({}, vueRadio.mapRequests('app', ['showConfirmationModal']), {
      addItems: function addItems(items) {
        items = Array.isArray(items) ? items : [items];
        var container = cloneDeep__default['default'](this.container);
        container.embeds = Object.assign({}, container.embeds, mapKeys__default['default'](items, 'id'));
        this.$emit('save', container);
      },
      reorderItem: function reorderItem(_ref) {
        var newPosition = _ref.newPosition,
            items = _ref.items;
        var context = {
          items: items,
          newPosition: newPosition
        };
        var container = cloneDeep__default['default'](this.container);
        var reordered = container.embeds[items[newPosition].id];
        reordered.position = utils.calculatePosition(context);
        this.$emit('save', container);
      },
      save: function save(item, key, value) {
        var container = cloneDeep__default['default'](this.container);
        container.embeds[item.id] = Object.assign({}, item, _defineProperty({}, key, value));
        this.$emit('save', container);
      },
      requestDeleteConfirmation: function requestDeleteConfirmation(element) {
        var _this = this;

        this.showConfirmationModal({
          title: 'Delete element?',
          message: 'Are you sure you want to delete element?',
          action: function action() {
            return _this.$emit('delete', element);
          }
        });
      }
    }),
    components: {
      ContainedContent: ContainedContent$1,
      ElementList: ElementList$1
    }
  };
  /* script */

  var __vue_script__$3$1 = script$3$1;
  /* template */

  var __vue_render__$3$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('element-list', {
      attrs: {
        "add-element-options": _vm.addElementOptions,
        "elements": _vm.embeds,
        "supported-types": _vm.types,
        "enable-add": !_vm.isDisabled && _vm.enableAdd
      },
      on: {
        "add": _vm.addItems,
        "update": _vm.reorderItem
      },
      scopedSlots: _vm._u([{
        key: "list-item",
        fn: function fn(ref) {
          var element = ref.element;
          var isDragged = ref.isDragged;
          return [_c('contained-content', _vm._b({
            staticClass: "my-2",
            attrs: {
              "element": element,
              "is-dragged": isDragged,
              "is-disabled": _vm.isDisabled
            },
            on: {
              "save": function save($event) {
                return _vm.save(element, 'data', $event);
              },
              "save:meta": function saveMeta($event) {
                return _vm.save(element, 'meta', $event);
              },
              "delete": function _delete($event) {
                return _vm.requestDeleteConfirmation(element);
              }
            }
          }, 'contained-content', _vm.$attrs, false))];
        }
      }])
    });
  };

  var __vue_staticRenderFns__$3$1 = [];
  /* style */

  var __vue_inject_styles__$3$1 = undefined;
  /* scoped */

  var __vue_scope_id__$3$1 = undefined;
  /* functional template */

  var __vue_is_functional_template__$3$1 = false;
  /* component normalizer */

  function __vue_normalize__$3$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "EmbeddedContainer.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  __vue_normalize__$3$1({
    render: __vue_render__$3$1,
    staticRenderFns: __vue_staticRenderFns__$3$1
  }, __vue_inject_styles__$3$1, __vue_script__$3$1, __vue_scope_id__$3$1, __vue_is_functional_template__$3$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$2$1 = {
    name: 'tailor-inline-activator',
    inheritAttrs: false,
    props: {
      disabled: {
        type: Boolean,
        required: false
      }
    }
  };
  var css_248z$2$1 = ".default-activator-state[data-v-64eb8c58],.inline-activator[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{padding:0 3.125rem;opacity:0}.inline-activator[data-v-64eb8c58]{display:flex;align-items:center;width:100%;margin:0;padding:0 3.125rem;opacity:0;transition:opacity .3s,padding .3s}.inline-activator[data-v-64eb8c58],.inline-activator .v-chip[data-v-64eb8c58]{cursor:pointer}.inline-activator hr[data-v-64eb8c58]{flex:1;display:inline-flex;margin:0;border-top:.0625rem dashed var(--v-primary-darken3)}.inline-activator[data-v-64eb8c58]:focus,.inline-activator[data-v-64eb8c58]:hover{padding:.75rem 0;opacity:1;outline:0;transition:opacity .3s .25s,padding .3s .1s}.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{pointer-events:none}";
  styleInject(css_248z$2$1);
  /* script */

  var __vue_script__$2$1 = script$2$1;
  /* template */

  var __vue_render__$2$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('button', _vm._g({
      staticClass: "inline-activator",
      class: {
        disabled: _vm.disabled
      }
    }, _vm.$listeners), [_c('hr'), _vm._v(" "), _c('v-avatar', {
      attrs: {
        "size": "20",
        "color": "primary darken-4"
      }
    }, [_c('v-icon', {
      attrs: {
        "size": "16",
        "dark": ""
      }
    }, [_vm._v("mdi-plus")])], 1), _vm._v(" "), _c('hr')], 1);
  };

  var __vue_staticRenderFns__$2$1 = [];
  /* style */

  var __vue_inject_styles__$2$1 = undefined;
  /* scoped */

  var __vue_scope_id__$2$1 = "data-v-64eb8c58";
  /* functional template */

  var __vue_is_functional_template__$2$1 = false;
  /* component normalizer */

  function __vue_normalize__$2$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "InlineActivator.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  __vue_normalize__$2$1({
    render: __vue_render__$2$1,
    staticRenderFns: __vue_staticRenderFns__$2$1
  }, __vue_inject_styles__$2$1, __vue_script__$2$1, __vue_scope_id__$2$1, __vue_is_functional_template__$2$1); //
  //
  //
  //
  //
  //
  //
  //


  var script$1$1 = {
    name: 'tailor-input-error',
    props: {
      error: {
        type: String,
        default: ''
      }
    }
  };
  var css_248z$1$1 = ".input-error[data-v-ff8d03d8]{color:var(--v-error-base);font-size:.75rem}";
  styleInject(css_248z$1$1);
  /* script */

  var __vue_script__$1$1 = script$1$1;
  /* template */

  var __vue_render__$1$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('transition', {
      attrs: {
        "name": "message-transition"
      }
    }, [!!_vm.error ? _c('div', {
      staticClass: "input-error"
    }, [_vm._v("\n    " + _vm._s(_vm.error) + "\n  ")]) : _vm._e()]);
  };

  var __vue_staticRenderFns__$1$1 = [];
  /* style */

  var __vue_inject_styles__$1$1 = undefined;
  /* scoped */

  var __vue_scope_id__$1$1 = "data-v-ff8d03d8";
  /* functional template */

  var __vue_is_functional_template__$1$1 = false;
  /* component normalizer */

  function __vue_normalize__$1$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "InputError.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  __vue_normalize__$1$1({
    render: __vue_render__$1$1,
    staticRenderFns: __vue_staticRenderFns__$1$1
  }, __vue_inject_styles__$1$1, __vue_script__$1$1, __vue_scope_id__$1$1, __vue_is_functional_template__$1$1); //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //


  var script$s = {
    name: 'tailor-preview-overlay',
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  };
  var css_248z$k = ".message[data-v-20303d2e]{border-radius:2px;font-size:1.125rem}";
  styleInject(css_248z$k);
  /* script */

  var __vue_script__$s = script$s;
  /* template */

  var __vue_render__$s = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-overlay', {
      attrs: {
        "value": _vm.show,
        "opacity": "0.9",
        "absolute": ""
      }
    }, [_c('button', {
      staticClass: "message pa-2 grey--text text--lighten-2"
    }, [_vm._t("default", [_vm._v("Click to preview")])], 2)]);
  };

  var __vue_staticRenderFns__$s = [];
  /* style */

  var __vue_inject_styles__$s = undefined;
  /* scoped */

  var __vue_scope_id__$s = "data-v-20303d2e";
  /* functional template */

  var __vue_is_functional_template__$s = false;
  /* component normalizer */

  function __vue_normalize__$s(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "PreviewOverlay.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;
    return component;
  }
  /* style inject */

  /* style inject SSR */


  __vue_normalize__$s({
    render: __vue_render__$s,
    staticRenderFns: __vue_staticRenderFns__$s
  }, __vue_inject_styles__$s, __vue_script__$s, __vue_scope_id__$s, __vue_is_functional_template__$s);

  //
  var script$p = {
    name: 'content-element-preview',
    props: {
      element: {
        type: Object,
        required: true
      },
      selectable: {
        type: Boolean,
        default: false
      },
      isSelected: {
        type: Boolean,
        default: false
      },
      selectionDisabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      disabled: function disabled(vm) {
        return vm.selectionDisabled && !vm.isSelected;
      },
      elementWidth: function elementWidth(vm) {
        return "col-xs-".concat(get__default['default'](vm.element, 'data.width', 12));
      }
    },
    methods: {
      toggleSelection: function toggleSelection() {
        if (!this.selectable || this.disabled) return;
        this.$emit('toggle');
      }
    },
    components: {
      ContentElement: ContentElement$2
    }
  };

  var css_248z$h = ".element-preview-container[data-v-249d7ad5]{display:flex;position:relative;margin:.25rem 0}.element-preview-container .v-input[data-v-249d7ad5]{margin:0}.content-element[data-v-249d7ad5]{flex:1 0;margin:.4375rem 0 0 .25rem;box-shadow:none;border:1px solid #e1e1e1}.content-element.selected[data-v-249d7ad5]{border-style:dashed;border-color:#444}.content-element.selected[data-v-249d7ad5]::after{display:none}.element-preview-container[data-v-249d7ad5]  .contained-content{margin:0}.element-preview-container[data-v-249d7ad5]  .contained-content .message span:not(.heading){display:none}.element-preview-container[data-v-249d7ad5]  .contained-content .ql-editor{word-break:break-all}.element-wrapper[data-v-249d7ad5]{position:relative}.open-element-button[data-v-249d7ad5]{position:absolute;top:0;right:-.75rem;transition:opacity .4s}.open-element-button[data-v-249d7ad5]:not(.visible){opacity:0}";
  styleInject(css_248z$h);

  /* script */
  var __vue_script__$p = script$p;
  /* template */

  var __vue_render__$p = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "element-preview-container float-none",
      class: _vm.elementWidth
    }, [_vm.selectable ? _c('v-checkbox', {
      attrs: {
        "input-value": _vm.isSelected,
        "disabled": _vm.disabled,
        "color": "primary darken-4"
      },
      on: {
        "click": _vm.toggleSelection
      }
    }) : _vm._e(), _vm._v(" "), _c('v-hover', {
      scopedSlots: _vm._u([{
        key: "default",
        fn: function fn(ref) {
          var hover = ref.hover;
          return [_c('div', {
            staticClass: "element-wrapper flex-grow-1"
          }, [_c('content-element', _vm._b({
            staticClass: "content-element",
            class: {
              selected: _vm.isSelected
            },
            attrs: {
              "element": _vm.element,
              "set-width": false
            }
          }, 'content-element', _vm.$attrs, false)), _vm._v(" "), _c('v-tooltip', {
            attrs: {
              "open-delay": "400",
              "top": ""
            },
            scopedSlots: _vm._u([{
              key: "activator",
              fn: function fn(ref) {
                var on = ref.on;
                return [_c('v-btn', _vm._g({
                  staticClass: "open-element-button",
                  class: {
                    visible: hover
                  },
                  attrs: {
                    "color": "blue-grey darken-4",
                    "fab": "",
                    "depressed": "",
                    "x-small": ""
                  },
                  on: {
                    "click": function click($event) {
                      $event.stopPropagation();
                      return _vm.$emit('element:open', _vm.element.uid);
                    }
                  }
                }, on), [_c('v-icon', {
                  attrs: {
                    "color": "secondary lighten-4",
                    "dense": ""
                  }
                }, [_vm._v("mdi-open-in-new")])], 1)];
              }
            }], null, true)
          }, [_vm._v(" "), _c('span', [_vm._v("Open in editor")])])], 1)];
        }
      }])
    })], 1);
  };

  var __vue_staticRenderFns__$p = [];
  /* style */

  var __vue_inject_styles__$p = undefined;
  /* scoped */

  var __vue_scope_id__$p = "data-v-249d7ad5";
  /* functional template */

  var __vue_is_functional_template__$p = false;
  /* component normalizer */

  function __vue_normalize__$p(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Element.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentElement$1 = __vue_normalize__$p({
    render: __vue_render__$p,
    staticRenderFns: __vue_staticRenderFns__$p
  }, __vue_inject_styles__$p, __vue_script__$p, __vue_scope_id__$p, __vue_is_functional_template__$p);

  //
  var script$o = {
    name: 'content-preview',
    props: {
      contentContainers: {
        type: Array,
        required: true
      },
      selectable: {
        type: Boolean,
        default: false
      },
      multiple: {
        type: Boolean,
        default: true
      },
      allowedTypes: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      selected: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    computed: {
      isSelectionDisabled: function isSelectionDisabled() {
        return this.selectable && !this.multiple && !!this.selected.length;
      },
      selectionMap: function selectionMap(vm) {
        return keyBy__default['default'](vm.selected, 'id');
      },
      processedContainers: function processedContainers() {
        var containers = this.contentContainers,
            allowedTypes = this.allowedTypes;
        if (!allowedTypes.length) return containers;
        return containers.map(function (container) {
          return Object.assign({}, container, {
            elements: container.elements.filter(function (it) {
              return allowedTypes.includes(it.type);
            })
          });
        });
      },
      elements: function elements() {
        var containers = this.processedContainers;
        return containers.reduce(function (acc, it) {
          return acc.concat(it.elements);
        }, []);
      }
    },
    components: {
      ContentElement: ContentElement$1
    }
  };

  var css_248z$g = ".content-preview .v-alert[data-v-2013b96d]{display:flex;align-items:center;justify-content:center;height:19rem}.content-preview .content-container[data-v-2013b96d]:last-child{margin-bottom:.625rem}";
  styleInject(css_248z$g);

  /* script */
  var __vue_script__$o = script$o;
  /* template */

  var __vue_render__$o = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content-preview"
    }, [!_vm.elements.length ? _c('v-alert', {
      staticClass: "mx-4",
      attrs: {
        "color": "grey darken-4",
        "text": ""
      }
    }, [_vm._v("\n    No available elements.\n  ")]) : _vm._e(), _vm._v(" "), _vm._l(_vm.processedContainers, function (container) {
      return _c('div', {
        key: container.id,
        staticClass: "content-container d-flex flex-wrap"
      }, _vm._l(container.elements, function (element) {
        return _c('content-element', {
          key: element.id,
          attrs: {
            "element": element,
            "selectable": _vm.selectable,
            "is-selected": !!_vm.selectionMap[element.id],
            "selection-disabled": _vm.isSelectionDisabled,
            "is-disabled": ""
          },
          on: {
            "toggle": function toggle($event) {
              return _vm.$emit('toggle', element);
            },
            "element:open": function elementOpen($event) {
              return _vm.$emit('element:open', $event);
            }
          }
        });
      }), 1);
    })], 2);
  };

  var __vue_staticRenderFns__$o = [];
  /* style */

  var __vue_inject_styles__$o = undefined;
  /* scoped */

  var __vue_scope_id__$o = "data-v-2013b96d";
  /* functional template */

  var __vue_is_functional_template__$o = false;
  /* component normalizer */

  function __vue_normalize__$o(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentPreview = __vue_normalize__$o({
    render: __vue_render__$o,
    staticRenderFns: __vue_staticRenderFns__$o
  }, __vue_inject_styles__$o, __vue_script__$o, __vue_scope_id__$o, __vue_is_functional_template__$o);

  function loader(action, name) {
    var minDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    return function () {
      var _this = this;

      this[name] = true;
      return pMinDelay_1(Promise.resolve(action.call.apply(action, [this].concat(Array.prototype.slice.call(arguments)))), minDuration).finally(function () {
        return _this[name] = false;
      });
    };
  }

  //
  var script$n = {
    name: 'select-activity',
    inject: ['$schema'],
    props: {
      selectedElements: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      activities: {
        type: Array,
        default: function _default() {
          return [];
        }
      }
    },
    data: function data() {
      return {
        search: ''
      };
    },
    computed: {
      groupedSelection: function groupedSelection(vm) {
        return groupBy__default['default'](vm.selectedElements, 'outlineId');
      },
      expandedActivityIds: function expandedActivityIds(vm) {
        return map__default['default'](vm.activities, 'id');
      },
      activityTree: function activityTree(vm) {
        return utils.toTreeFormat(vm.activities, vm.$schema, []);
      },
      noResultsMessage: function noResultsMessage() {
        var activities = this.activities,
            search = this.search,
            $refs = this.$refs;
        if (!activities.length) return 'Empty repository';
        if (!search || !$refs) return '';
        var _$refs$treeview = $refs.treeview,
            excludedItems = _$refs$treeview.excludedItems,
            nodes = _$refs$treeview.nodes;
        var hasSearchResults = excludedItems.size !== Object.keys(nodes).length;
        return !hasSearchResults && 'No matches found';
      }
    },
    methods: {
      hasContentContainers: function hasContentContainers(type) {
        return this.$schema.isEditable(type);
      },
      getChipLabel: function getChipLabel(_ref) {
        var length = _ref.length;
        return "".concat(length, " ").concat(pluralize__default['default']('element', length), " selected");
      }
    }
  };

  var css_248z$f = ".treeview[data-v-11dfe634]{max-height:19rem;text-align:left;background-color:#fcfcfc;border:1px solid #eee;overflow-y:scroll}.treeview .v-chip.custom-chip[data-v-11dfe634]{border-radius:12px!important}.treeview[data-v-11dfe634]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__content>*,.treeview[data-v-11dfe634]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__root{cursor:auto}";
  styleInject(css_248z$f);

  /* script */
  var __vue_script__$n = script$n;
  /* template */

  var __vue_render__$n = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "mx-3"
    }, [_c('v-text-field', {
      attrs: {
        "disabled": !_vm.activities.length,
        "placeholder": "Filter items...",
        "prepend-inner-icon": "mdi-filter-outline",
        "clear-icon": "mdi-close-circle-outline",
        "clearable": "",
        "outlined": ""
      },
      model: {
        value: _vm.search,
        callback: function callback($$v) {
          _vm.search = $$v;
        },
        expression: "search"
      }
    }), _vm._v(" "), _c('v-treeview', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: !_vm.noResultsMessage,
        expression: "!noResultsMessage"
      }],
      ref: "treeview",
      staticClass: "py-3 px-1 treeview",
      attrs: {
        "items": _vm.activityTree,
        "search": _vm.search,
        "open": _vm.expandedActivityIds,
        "transition": "",
        "open-on-click": ""
      },
      scopedSlots: _vm._u([{
        key: "label",
        fn: function fn(ref) {
          var ref_item = ref.item;
          var id = ref_item.id;
          var data = ref_item.data;
          return [_vm._v("\n      " + _vm._s(data.name) + "\n      "), _vm.groupedSelection[id] ? _c('v-chip', {
            staticClass: "readonly custom-chip",
            attrs: {
              "rounded": "",
              "small": ""
            }
          }, [_vm._v("\n        " + _vm._s(_vm.getChipLabel(_vm.groupedSelection[id])) + "\n      ")]) : _vm._e()];
        }
      }, {
        key: "append",
        fn: function fn(ref) {
          var item = ref.item;
          return [_vm.hasContentContainers(item.type) ? _c('v-btn', {
            attrs: {
              "color": "primary darken-2",
              "outlined": "",
              "small": ""
            },
            on: {
              "click": function click($event) {
                return _vm.$emit('selected', item);
              }
            }
          }, [_vm._v("\n        View elements\n      ")]) : _vm._e()];
        }
      }])
    }), _vm._v(" "), _c('v-alert', {
      attrs: {
        "value": !!_vm.noResultsMessage,
        "color": "primary darken-2",
        "dark": ""
      }
    }, [_vm._v("\n    " + _vm._s(_vm.noResultsMessage) + "\n  ")])], 1);
  };

  var __vue_staticRenderFns__$n = [];
  /* style */

  var __vue_inject_styles__$n = undefined;
  /* scoped */

  var __vue_scope_id__$n = "data-v-11dfe634";
  /* functional template */

  var __vue_is_functional_template__$n = false;
  /* component normalizer */

  function __vue_normalize__$n(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "SelectActivity.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectActivity = __vue_normalize__$n({
    render: __vue_render__$n,
    staticRenderFns: __vue_staticRenderFns__$n
  }, __vue_inject_styles__$n, __vue_script__$n, __vue_scope_id__$n, __vue_is_functional_template__$n);

  //
  var script$m = {
    name: 'select-repository',
    props: {
      repository: {
        type: Object,
        default: null
      }
    },
    data: function data() {
      return {
        repositories: [],
        loading: false
      };
    },
    methods: {
      selectRepository: function selectRepository(repository) {
        if (find__default['default'](this.repositories, {
          id: repository.id
        })) {
          this.$emit('selected', repository);
        }
      },
      fetchRepositories: debounce__default['default'](loader(function (search) {
        var _this = this;

        return api.repository.getRepositories({
          search: search
        }).then(function (repositories) {
          _this.repositories = sortBy__default['default'](repositories, 'name');
        });
      }, 'loading'), 500)
    },
    created: function created() {
      this.fetchRepositories();
    }
  };

  /* script */
  var __vue_script__$m = script$m;
  /* template */

  var __vue_render__$m = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-combobox', _vm._b({
      staticClass: "mx-3",
      attrs: {
        "value": _vm.repository,
        "items": _vm.repositories,
        "loading": _vm.loading,
        "item-value": "id",
        "item-text": "name",
        "label": "Select repository",
        "placeholder": "Type to search repositories...",
        "outlined": "",
        "return-object": ""
      },
      on: {
        "input": _vm.selectRepository,
        "update:search-input": _vm.fetchRepositories
      }
    }, 'v-combobox', _vm.$attrs, false));
  };

  var __vue_staticRenderFns__$m = [];
  /* style */

  var __vue_inject_styles__$m = undefined;
  /* scoped */

  var __vue_scope_id__$m = undefined;
  /* functional template */

  var __vue_is_functional_template__$m = false;
  /* component normalizer */

  function __vue_normalize__$m(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "SelectRepository.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectRepository = __vue_normalize__$m({
    render: __vue_render__$m,
    staticRenderFns: __vue_staticRenderFns__$m
  }, __vue_inject_styles__$m, __vue_script__$m, __vue_scope_id__$m, __vue_is_functional_template__$m);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$l = {
    name: 'tailor-dialog',
    props: {
      headerIcon: {
        type: String,
        default: null
      },
      width: {
        type: [Number, String],
        default: 500
      },
      paddingless: {
        type: Boolean,
        default: false
      }
    }
  };

  var css_248z$e = ".dialog-title[data-v-b6f646a2]{display:flex;color:#f1f1f1}.dialog-title .text-truncate[data-v-b6f646a2]{flex:1;text-align:left}";
  styleInject(css_248z$e);

  /* script */
  var __vue_script__$l = script$l;
  /* template */

  var __vue_render__$l = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-dialog', _vm._g(_vm._b({
      attrs: {
        "width": _vm.width
      },
      scopedSlots: _vm._u([_vm._l(_vm.$scopedSlots, function (_, slot) {
        return {
          key: slot,
          fn: function fn(scope) {
            return [_vm._t(slot, null, null, scope)];
          }
        };
      })], null, true)
    }, 'v-dialog', _vm.$attrs, false), _vm.$listeners), [_vm._v(" "), _c('v-card', [_c('v-card-title', {
      staticClass: "dialog-title primary darken-3",
      attrs: {
        "primary-title": ""
      }
    }, [_vm.headerIcon ? _c('v-avatar', {
      staticClass: "mr-3",
      attrs: {
        "color": "secondary",
        "size": "38"
      }
    }, [_c('v-icon', {
      attrs: {
        "dark": ""
      }
    }, [_vm._v(_vm._s(_vm.headerIcon))])], 1) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "text-truncate"
    }, [_vm._t("header")], 2)], 1), _vm._v(" "), _c('v-card-text', {
      class: [_vm.paddingless ? 'pa-0' : 'pt-7 px-4 pb-2']
    }, [_vm._t("body")], 2), _vm._v(" "), _vm.$slots.actions ? _c('v-card-actions', {
      staticClass: "px-4 pb-3"
    }, [_c('v-spacer'), _vm._v(" "), _vm._t("actions")], 2) : _vm._e()], 1)], 1);
  };

  var __vue_staticRenderFns__$l = [];
  /* style */

  var __vue_inject_styles__$l = undefined;
  /* scoped */

  var __vue_scope_id__$l = "data-v-b6f646a2";
  /* functional template */

  var __vue_is_functional_template__$l = false;
  /* component normalizer */

  function __vue_normalize__$l(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "TailorDialog.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var TailorDialog = __vue_normalize__$l({
    render: __vue_render__$l,
    staticRenderFns: __vue_staticRenderFns__$l
  }, __vue_inject_styles__$l, __vue_script__$l, __vue_scope_id__$l, __vue_is_functional_template__$l);

  var TOGGLE_BUTTON = {
    SELECT: {
      label: 'Select all',
      icon: 'checkbox-multiple-marked-outline'
    },
    DESELECT: {
      label: 'Deselect all',
      icon: 'checkbox-multiple-blank-outline'
    }
  };
  var script$k = {
    name: 'select-element',
    inject: ['$schema'],
    props: {
      selected: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      heading: {
        type: String,
        required: true
      },
      allowedTypes: {
        type: Array,
        required: true
      },
      multiple: {
        type: Boolean,
        default: true
      },
      submitLabel: {
        type: String,
        default: 'Save'
      },
      headerIcon: {
        type: String,
        default: 'mdi-toy-brick-plus-outline'
      },
      onlyCurrentRepo: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        items: {
          activities: [],
          contentContainers: []
        },
        selection: {
          repository: null,
          activity: null,
          elements: []
        },
        loadingContent: false
      };
    },
    computed: Object.assign({}, mapGetters('repository', {
      currentRepository: 'repository',
      currentActivities: 'activities'
    }), {
      allElementsSelected: function allElementsSelected(vm) {
        return vm.selection.elements.length === vm.elements.length;
      },
      rootContainerTypes: function rootContainerTypes() {
        var _this$selection$activ;

        var type = (_this$selection$activ = this.selection.activity) === null || _this$selection$activ === void 0 ? void 0 : _this$selection$activ.type;
        return type && this.getContainerTypes(type);
      },
      processedContainers: function processedContainers() {
        var _this = this;

        var activity = this.selection.activity,
            activities = this.items.activities;
        if (!activity || !activities.length) return [];
        var containers = sortBy__default['default'](activities.filter(this.isRootContainer), [this.getTypePosition, 'position', 'createdAt']);
        return flatMap__default['default'](containers, function (it) {
          return [it].concat(_toConsumableArray$1(_this.getSubcontainers(it)));
        });
      },
      elements: function elements() {
        var _this2 = this;

        var elements = flatMap__default['default'](this.items.contentContainers, 'elements');
        if (!this.allowedTypes.length) return elements;
        return elements.filter(function (it) {
          return _this2.allowedTypes.includes(it.type);
        });
      },
      toggleButton: function toggleButton() {
        var allElementsSelected = this.allElementsSelected,
            elements = this.elements,
            multiple = this.multiple,
            selection = this.selection;
        if (!multiple || !selection.activity || !elements.length) return;
        var SELECT = TOGGLE_BUTTON.SELECT,
            DESELECT = TOGGLE_BUTTON.DESELECT;
        return allElementsSelected ? DESELECT : SELECT;
      }
    }),
    methods: {
      getContainerTypes: function getContainerTypes(type) {
        return map__default['default'](this.$schema.getSupportedContainers(type), 'type');
      },
      getTypePosition: function getTypePosition(_ref) {
        var type = _ref.type;
        return this.rootContainerTypes.indexOf(type);
      },
      isRootContainer: function isRootContainer(_ref2) {
        var parentId = _ref2.parentId,
            type = _ref2.type;
        var activity = this.selection.activity,
            rootContainerTypes = this.rootContainerTypes;
        return parentId === activity.id && rootContainerTypes.includes(type);
      },
      getSubcontainers: function getSubcontainers(container) {
        var activities = this.items.activities;
        return sortBy__default['default'](utils.getDescendants(activities, container), 'position');
      },
      showActivityElements: async function showActivityElements(activity) {
        var _this3 = this;

        this.selection.activity = activity;
        var processedContainers = this.processedContainers;
        var elements = await this.fetchElements(processedContainers);
        this.items.contentContainers = processedContainers.map(function (container) {
          return _this3.assignElements(container, activity, elements);
        });
      },
      assignElements: function assignElements(container, activity, elements) {
        var containerElements = elements.filter(function (it) {
          return it.activityId === container.id;
        }).map(function (element) {
          return Object.assign({}, element, {
            activity: activity
          });
        });
        return Object.assign({}, container, {
          elements: sortBy__default['default'](containerElements, 'position')
        });
      },
      toggleElementSelection: function toggleElementSelection(element) {
        var elements = this.selection.elements;
        var existing = elements.find(function (it) {
          return it.id === element.id;
        });
        this.selection.elements = existing ? elements.filter(function (it) {
          return it.id !== element.id;
        }) : elements.concat(element);
      },
      toggleSelectAll: function toggleSelectAll() {
        this.selection.elements = this.allElementsSelected ? [] : this.elements;
      },
      deselectActivity: function deselectActivity() {
        this.selection.activity = null;
        this.items.contentContainers = [];
        this.selection.elements = _toConsumableArray$1(this.selected);
      },
      selectRepository: async function selectRepository(repository) {
        var currentActivities = this.currentActivities,
            currentRepository = this.currentRepository;
        this.selection.repository = repository;
        this.deselectActivity();
        this.items.activities = currentRepository.id === repository.id ? currentActivities : await this.fetchActivities(repository);
      },
      fetchActivities: loader(function (repository) {
        return api.activity.getActivities(repository.id);
      }, 'loadingContent'),
      fetchElements: loader(function (containers) {
        var repositoryId = this.selection.repository.id;
        var queryOpts = {
          repositoryId: repositoryId,
          ids: containers.map(function (it) {
            return it.id;
          })
        };
        return api.contentElement.fetch(queryOpts);
      }, 'loadingContent', 500),
      save: function save() {
        this.$emit('selected', _toConsumableArray$1(this.selection.elements));
        this.close();
      },
      close: function close() {
        this.$emit('close');
      },
      openInEditor: function openInEditor(elementId) {
        var params = {
          activityId: this.selection.activity.id,
          repositoryId: this.selection.repository.id
        };
        var route = {
          name: 'editor',
          params: params,
          query: {
            elementId: elementId
          }
        };

        var _this$$router$resolve = this.$router.resolve(route),
            href = _this$$router$resolve.href;

        window.open(href, '_blank');
      }
    },
    created: function created() {
      this.selection.elements = _toConsumableArray$1(this.selected);
      this.selection.repository = this.currentRepository;
      this.items.activities = this.currentActivities;
    },
    components: {
      ContentPreview: ContentPreview,
      SelectActivity: SelectActivity,
      SelectRepository: SelectRepository,
      TailorDialog: TailorDialog
    }
  };

  /* script */
  var __vue_script__$k = script$k;
  /* template */

  var __vue_render__$k = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('tailor-dialog', {
      attrs: {
        "value": true,
        "header-icon": _vm.headerIcon,
        "width": "650",
        "scrollable": ""
      },
      on: {
        "click:outside": _vm.close
      },
      scopedSlots: _vm._u([{
        key: "header",
        fn: function fn() {
          return [_vm._v(_vm._s(_vm.heading))];
        },
        proxy: true
      }, {
        key: "body",
        fn: function fn() {
          return [!_vm.selection.activity ? [_c('select-repository', {
            attrs: {
              "repository": _vm.selection.repository,
              "disabled": _vm.onlyCurrentRepo
            },
            on: {
              "selected": _vm.selectRepository
            }
          }), _vm._v(" "), _vm.loadingContent ? _c('v-progress-circular', {
            staticClass: "mt-5",
            attrs: {
              "indeterminate": ""
            }
          }) : _c('select-activity', {
            attrs: {
              "activities": _vm.items.activities,
              "selected-elements": _vm.selection.elements
            },
            on: {
              "selected": _vm.showActivityElements
            }
          })] : [_vm.toggleButton ? _c('div', {
            staticClass: "d-flex justify-end mb-2 px-4"
          }, [_c('v-btn', {
            attrs: {
              "outlined": ""
            },
            on: {
              "click": _vm.toggleSelectAll
            }
          }, [_c('v-icon', {
            staticClass: "mr-2"
          }, [_vm._v("mdi-" + _vm._s(_vm.toggleButton.icon))]), _vm._v("\n          " + _vm._s(_vm.toggleButton.label) + "\n        ")], 1)], 1) : _vm._e(), _vm._v(" "), _vm.loadingContent ? _c('v-progress-circular', {
            staticClass: "mt-5",
            attrs: {
              "indeterminate": ""
            }
          }) : _c('content-preview', {
            attrs: {
              "content-containers": _vm.items.contentContainers,
              "selected": _vm.selection.elements,
              "allowed-types": _vm.allowedTypes,
              "multiple": _vm.multiple,
              "selectable": ""
            },
            on: {
              "toggle": _vm.toggleElementSelection,
              "element:open": _vm.openInEditor
            }
          })]];
        },
        proxy: true
      }, {
        key: "actions",
        fn: function fn() {
          return [_vm.selection.activity ? _c('v-btn', {
            staticClass: "mr-2",
            attrs: {
              "text": "",
              "outlined": ""
            },
            on: {
              "click": _vm.deselectActivity
            }
          }, [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "dense": ""
            }
          }, [_vm._v("mdi-arrow-left")]), _vm._v("Back\n    ")], 1) : _vm._e(), _vm._v(" "), _c('v-btn', {
            staticClass: "ml-1",
            attrs: {
              "text": ""
            },
            on: {
              "click": _vm.close
            }
          }, [_vm._v("Cancel")]), _vm._v(" "), _c('v-btn', {
            staticClass: "mr-2",
            attrs: {
              "text": ""
            },
            on: {
              "click": _vm.save
            }
          }, [_vm._v(_vm._s(_vm.submitLabel))])];
        },
        proxy: true
      }])
    });
  };

  var __vue_staticRenderFns__$k = [];
  /* style */

  var __vue_inject_styles__$k = undefined;
  /* scoped */

  var __vue_scope_id__$k = undefined;
  /* functional template */

  var __vue_is_functional_template__$k = false;
  /* component normalizer */

  function __vue_normalize__$k(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var SelectElement = __vue_normalize__$k({
    render: __vue_render__$k,
    staticRenderFns: __vue_staticRenderFns__$k
  }, __vue_inject_styles__$k, __vue_script__$k, __vue_scope_id__$k, __vue_is_functional_template__$k);

  //
  var DEFAULT_ELEMENT_WIDTH = 100;
  var LAYOUT = {
    HALF_WIDTH: 6,
    FULL_WIDTH: 12
  };
  var ELEMENT_GROUPS = [{
    name: 'Content Elements',
    icon: 'mdi-set-center'
  }, {
    name: 'Assessments',
    icon: 'mdi-help-rhombus'
  }, {
    name: 'Nongraded questions',
    icon: 'mdi-comment-question-outline'
  }];

  var getQuestionData = function getQuestionData(element, type) {
    var data = {
      width: LAYOUT.FULL_WIDTH
    };
    var question = [{
      id: utils.uuid(),
      data: data,
      type: 'JODIT_HTML',
      embedded: true
    }];
    return Object.assign({
      question: question,
      type: type
    }, element.data);
  };

  var script$j = {
    name: 'tailor-add-element',
    inject: ['$teRegistry'],
    props: {
      items: {
        type: Array,
        required: true
      },
      activity: {
        type: Object,
        default: null
      },
      position: {
        type: Number,
        default: null
      },
      layout: {
        type: Boolean,
        default: true
      },
      include: {
        type: Array,
        default: null
      },
      show: {
        type: Boolean,
        default: false
      },
      large: {
        type: Boolean,
        default: false
      },
      label: {
        type: String,
        default: 'Add content'
      },
      icon: {
        type: String,
        default: 'mdi-plus'
      }
    },
    data: function data() {
      return {
        isVisible: false,
        elementWidth: DEFAULT_ELEMENT_WIDTH,
        showElementBrowser: false
      };
    },
    computed: {
      registry: function registry() {
        return this.$teRegistry.all;
      },
      questions: function questions() {
        return filter__default['default'](this.registry, {
          type: 'QUESTION'
        });
      },
      contentElements: function contentElements() {
        var _this = this;

        var items = filter__default['default'](this.registry, function (it) {
          return !utils.isQuestion(it.type);
        });
        if (!this.isSubset) return items;
        return filter__default['default'](items, function (it) {
          return _this.include.includes(it.type);
        });
      },
      assessments: function assessments() {
        var registry = this.registry,
            isSubset = this.isSubset,
            include = this.include,
            questions = this.questions;
        if (isSubset && !include.includes('ASSESSMENT')) return [];
        return filter__default['default'](registry, {
          type: 'ASSESSMENT'
        }).concat(questions.map(function (it) {
          return Object.assign({}, it, {
            type: 'ASSESSMENT'
          });
        }));
      },
      reflections: function reflections() {
        var registry = this.registry,
            isSubset = this.isSubset,
            include = this.include,
            questions = this.questions;
        if (isSubset && !include.includes('REFLECTION')) return [];
        return filter__default['default'](registry, {
          type: 'REFLECTION'
        }).concat(questions.map(function (it) {
          return Object.assign({}, it, {
            type: 'REFLECTION'
          });
        }));
      },
      isSubset: function isSubset() {
        return !!this.include && !!this.include.length;
      },
      library: function library() {
        var groups = [this.contentElements, this.assessments, this.reflections];
        return reduce__default['default'](groups, function (acc, elements, i) {
          if (elements.length) acc.push(Object.assign({}, ELEMENT_GROUPS[i], {
            elements: elements
          }));
          return acc;
        }, []);
      },
      processedWidth: function processedWidth() {
        return this.elementWidth === 50 ? LAYOUT.HALF_WIDTH : LAYOUT.FULL_WIDTH;
      },
      allowedTypes: function allowedTypes() {
        var elementWidth = this.elementWidth,
            include = this.include,
            layout = this.layout,
            library = this.library;
        var elements = flatMap__default['default'](library, 'elements');
        if (!layout) return include || [];
        var allowedElements = elementWidth === DEFAULT_ELEMENT_WIDTH ? elements : reject__default['default'](elements, 'ui.forceFullWidth');
        var allowedTypes = allowedElements.map(function (it) {
          return it.type;
        });
        return include ? intersection__default['default'](include, allowedTypes) : allowedTypes;
      }
    },
    methods: {
      addElements: function addElements(elements) {
        var _this2 = this;

        var positions = utils.getPositions(this.items, this.position, elements.length);
        var items = elements.map(function (it, index) {
          return _this2.buildElement(Object.assign({}, it, {
            position: positions[index]
          }));
        });
        this.$emit('add', items);
        this.isVisible = false;
      },
      buildElement: function buildElement(el) {
        var width = this.processedWidth,
            activity = this.activity;
        var position = el.position,
            subtype = el.subtype,
            _el$data = el.data,
            data = _el$data === void 0 ? {} : _el$data,
            _el$initState = el.initState,
            initState = _el$initState === void 0 ? function () {
          return {};
        } : _el$initState;
        var element = Object.assign({
          position: position
        }, pick__default['default'](el, ['type', 'refs']), {
          data: Object.assign({}, initState(), data, {
            width: width
          })
        });
        var contextData = activity ? {
          activityId: activity.id
        } // If content element within activity
        : {
          id: utils.uuid(),
          embedded: true
        }; // If embed, assign id

        Object.assign(element, contextData);
        if (utils.isQuestion(element.type)) element.data = getQuestionData(element, subtype);
        if (element.type === 'REFLECTION') delete element.data.correct;
        return element;
      },
      onHidden: function onHidden() {
        this.elementWidth = DEFAULT_ELEMENT_WIDTH;
        this.$emit('hidden');
      },
      showElementPicker: function showElementPicker() {
        this.isVisible = true;
      }
    },
    watch: {
      isVisible: function isVisible(val, oldVal) {
        if (!val && oldVal) this.onHidden();
      },
      show: function show(val) {
        return val ? this.showElementPicker() : this.onHidden();
      }
    },
    components: {
      AddNewElement: AddNewElement$1,
      SelectElement: SelectElement
    }
  };

  /* script */
  var __vue_script__$j = script$j;
  /* template */

  var __vue_render__$j = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "add-element-container"
    }, [_vm._t("default", [_vm.large ? _c('v-btn', {
      staticClass: "mt-3 mb-4",
      attrs: {
        "color": "primary darken-3",
        "text": ""
      },
      on: {
        "click": function click($event) {
          $event.stopPropagation();
          return _vm.showElementPicker($event);
        }
      }
    }, [_c('v-icon', {
      staticClass: "pr-2"
    }, [_vm._v(_vm._s(_vm.icon))]), _vm._v(_vm._s(_vm.label) + "\n    ")], 1) : _c('v-btn', {
      attrs: {
        "color": "primary darken-3",
        "icon": "",
        "text": ""
      },
      on: {
        "click": function click($event) {
          $event.stopPropagation();
          return _vm.showElementPicker($event);
        }
      }
    }, [_c('v-icon', [_vm._v(_vm._s(_vm.icon))])], 1)], {
      "addElement": _vm.showElementPicker
    }), _vm._v(" "), _vm.isVisible ? [_vm.showElementBrowser ? _c('select-element', {
      attrs: {
        "allowed-types": _vm.allowedTypes,
        "submit-label": "Copy",
        "heading": "Copy elements",
        "header-icon": "mdi-content-duplicate",
        "multiple": ""
      },
      on: {
        "selected": _vm.addElements,
        "close": function close($event) {
          _vm.showElementBrowser = false;
        }
      }
    }) : _c('add-new-element', {
      attrs: {
        "library": _vm.library,
        "allowed-types": _vm.allowedTypes
      },
      on: {
        "add": _vm.addElements
      },
      scopedSlots: _vm._u([{
        key: "header",
        fn: function fn() {
          return [_vm.layout ? _c('div', {
            staticClass: "mr-6"
          }, [_c('div', {
            staticClass: "pb-1 caption text-left"
          }, [_vm._v("Element width")]), _vm._v(" "), _c('v-btn-toggle', {
            attrs: {
              "color": "secondary accent-2",
              "mandatory": ""
            },
            model: {
              value: _vm.elementWidth,
              callback: function callback($$v) {
                _vm.elementWidth = $$v;
              },
              expression: "elementWidth"
            }
          }, [_c('v-btn', {
            attrs: {
              "value": 100,
              "height": "38",
              "icon": ""
            }
          }, [_c('v-icon', [_vm._v("mdi-square-outline")])], 1), _vm._v(" "), _c('v-btn', {
            attrs: {
              "value": 50,
              "height": "38",
              "icon": ""
            }
          }, [_c('v-icon', [_vm._v("mdi-select-compare")])], 1)], 1)], 1) : _vm._e(), _vm._v(" "), _c('v-btn', {
            staticClass: "mt-6",
            attrs: {
              "color": "primary darken-3",
              "depressed": ""
            },
            on: {
              "click": function click($event) {
                _vm.showElementBrowser = !_vm.showElementBrowser;
              }
            }
          }, [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "dense": ""
            }
          }, [_vm._v("mdi-content-copy")]), _vm._v("\n          Copy existing\n        ")], 1)];
        },
        proxy: true
      }], null, false, 2543524328),
      model: {
        value: _vm.isVisible,
        callback: function callback($$v) {
          _vm.isVisible = $$v;
        },
        expression: "isVisible"
      }
    })] : _vm._e()], 2);
  };

  var __vue_staticRenderFns__$j = [];
  /* style */

  var __vue_inject_styles__$j = undefined;
  /* scoped */

  var __vue_scope_id__$j = undefined;
  /* functional template */

  var __vue_is_functional_template__$j = false;
  /* component normalizer */

  function __vue_normalize__$j(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var AddElement = __vue_normalize__$j({
    render: __vue_render__$j,
    staticRenderFns: __vue_staticRenderFns__$j
  }, __vue_inject_styles__$j, __vue_script__$j, __vue_scope_id__$j, __vue_is_functional_template__$j);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$i = {
    name: 'tailor-editor-link',
    props: {
      activityId: {
        type: Number,
        required: true
      },
      elementUid: {
        type: String,
        default: null
      },
      label: {
        type: String,
        required: true
      }
    },
    computed: {
      editorRoute: function editorRoute(_ref) {
        var activityId = _ref.activityId,
            elementUid = _ref.elementUid;
        return Object.assign({
          name: 'editor',
          params: {
            activityId: activityId
          }
        }, elementUid && {
          query: {
            elementId: elementUid
          }
        });
      }
    }
  };

  /* script */
  var __vue_script__$i = script$i;
  /* template */

  var __vue_render__$i = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "editor-link"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('router-link', {
            attrs: {
              "to": _vm.editorRoute
            },
            scopedSlots: _vm._u([{
              key: "default",
              fn: function fn(ref) {
                var navigate = ref.navigate;
                var isExactActive = ref.isExactActive;
                return [_c('v-btn', _vm._g(_vm._b({
                  attrs: {
                    "color": isExactActive ? 'teal accent-4' : 'primary',
                    "text": "",
                    "x-small": ""
                  },
                  on: {
                    "click": navigate
                  }
                }, 'v-btn', _vm.$attrs, false), on), [_vm._v("\n          " + _vm._s(_vm.label) + "\n          "), _vm._t("icon", [_c('v-icon', {
                  staticClass: "ml-1",
                  attrs: {
                    "x-small": ""
                  }
                }, [_vm._v("mdi-arrow-top-right-thick")])])], 2)];
              }
            }], null, true)
          })];
        }
      }])
    }, [_vm._v(" "), _vm._t("tooltip", [_c('span', [_vm._v("View element")])])], 2)], 1);
  };

  var __vue_staticRenderFns__$i = [];
  /* style */

  var __vue_inject_styles__$i = undefined;
  /* scoped */

  var __vue_scope_id__$i = undefined;
  /* functional template */

  var __vue_is_functional_template__$i = false;
  /* component normalizer */

  function __vue_normalize__$i(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "EditorLink.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var EditorLink = __vue_normalize__$i({
    render: __vue_render__$i,
    staticRenderFns: __vue_staticRenderFns__$i
  }, __vue_inject_styles__$i, __vue_script__$i, __vue_scope_id__$i, __vue_is_functional_template__$i);

  //

  var getOptions = function getOptions() {
    return {
      resolve: {
        action: 'resolve',
        icon: 'check-box-outline',
        color: 'teal accent-4'
      },
      edit: {
        action: 'toggleEdit',
        icon: 'pencil-outline',
        color: 'grey'
      },
      remove: {
        action: 'remove',
        icon: 'trash-can-outline',
        color: 'grey'
      }
    };
  };

  var script$h = {
    name: 'comment-header',
    props: {
      comment: {
        type: Object,
        required: true
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      isResolved: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    computed: {
      elementUid: function elementUid(vm) {
        return vm.comment.contentElement.uid;
      },
      author: function author(vm) {
        return vm.comment.author;
      },
      isAuthor: function isAuthor(vm) {
        return vm.author.id === vm.user.id;
      },
      isDeleted: function isDeleted(vm) {
        return !!vm.comment.deletedAt;
      },
      showEditedLabel: function showEditedLabel(vm) {
        return !!vm.comment.editedAt;
      },
      showOptions: function showOptions(vm) {
        return vm.isAuthor && !vm.isDeleted && !vm.isResolved;
      },
      options: function options() {
        var options = getOptions();
        if (this.isActivityThread) delete options.resolve;
        return options;
      }
    },
    components: {
      EditorLink: EditorLink
    }
  };

  var css_248z$d = ".header[data-v-a1e0c4e8]{display:flex;align-items:flex-start}.header .comment-avatar[data-v-a1e0c4e8]{margin:.375rem .375rem 0 0}.header .info-container[data-v-a1e0c4e8]{display:flex;flex-direction:column;flex:0 100%;max-width:calc(100% - 8rem);margin-left:.125rem}.header .info-container .author[data-v-a1e0c4e8]{display:inline-block;max-width:75%;color:#000;font-size:1rem}.header .info-container .edited[data-v-a1e0c4e8],.header .info-container .time[data-v-a1e0c4e8]{color:#888;font-size:.75rem}.header .info-container hr.v-divider--vertical[data-v-a1e0c4e8]{margin:.25rem .125rem .125rem .625rem}.header .info-container[data-v-a1e0c4e8]  .editor-link{display:inline-flex;align-self:flex-end}.header .actions[data-v-a1e0c4e8]{margin-left:auto}";
  styleInject(css_248z$d);

  /* script */
  var __vue_script__$h = script$h;
  /* template */

  var __vue_render__$h = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "header"
    }, [_c('v-avatar', {
      staticClass: "comment-avatar",
      attrs: {
        "size": "34"
      }
    }, [_c('img', {
      attrs: {
        "src": _vm.author.imgUrl
      }
    })]), _vm._v(" "), _c('div', {
      staticClass: "info-container"
    }, [_c('div', {
      staticClass: "d-flex align-center"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('span', _vm._g({
            staticClass: "author text-truncate"
          }, on), [_vm._v(_vm._s(_vm.author.label))])];
        }
      }])
    }, [_vm._v("\n        " + _vm._s(_vm.author.label) + "\n      ")]), _vm._v(" "), _vm.showEditedLabel ? _c('span', {
      staticClass: "edited ml-1"
    }, [_vm._v("(edited)")]) : _vm._e()], 1), _vm._v(" "), _c('div', {
      staticClass: "d-flex align-center"
    }, [_c('v-tooltip', {
      attrs: {
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('span', _vm._g({}, on), [_c('timeago', {
            staticClass: "time",
            attrs: {
              "datetime": _vm.comment.createdAt,
              "auto-update": 60
            }
          })], 1)];
        }
      }])
    }, [_vm._v(" "), _c('span', [_vm._v(_vm._s(_vm._f("formatDate")(_vm.comment.createdAt, 'DD. MMM h:mm A')))])]), _vm._v(" "), _vm.isActivityThread && _vm.elementLabel ? [_c('v-divider', {
      attrs: {
        "vertical": ""
      }
    }), _vm._v(" "), _c('editor-link', {
      attrs: {
        "activity-id": _vm.comment.activityId,
        "element-uid": _vm.elementUid,
        "label": _vm.elementLabel
      }
    })] : _vm._e()], 2)]), _vm._v(" "), _vm.showOptions ? _c('div', {
      staticClass: "actions"
    }, _vm._l(_vm.options, function (ref, name) {
      var action = ref.action;
      var icon = ref.icon;
      var color = ref.color;
      return _c('v-btn', {
        key: name,
        staticClass: "ml-1",
        attrs: {
          "x-small": "",
          "icon": ""
        },
        on: {
          "click": function click($event) {
            return _vm.$emit(action);
          }
        }
      }, [_c('v-icon', {
        attrs: {
          "color": color,
          "size": "14"
        }
      }, [_vm._v(" mdi-" + _vm._s(icon))])], 1);
    }), 1) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$h = [];
  /* style */

  var __vue_inject_styles__$h = undefined;
  /* scoped */

  var __vue_scope_id__$h = "data-v-a1e0c4e8";
  /* functional template */

  var __vue_is_functional_template__$h = false;
  /* component normalizer */

  function __vue_normalize__$h(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Header.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var CommentHeader = __vue_normalize__$h({
    render: __vue_render__$h,
    staticRenderFns: __vue_staticRenderFns__$h
  }, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$g = {
    name: 'comment-preview',
    props: {
      content: {
        type: String,
        default: ''
      },
      isResolved: {
        type: Boolean,
        default: false
      }
    }
  };

  var css_248z$c = ".content[data-v-3d625308]{margin-top:.375rem}.content pre[data-v-3d625308]{height:100%;margin:0;padding:0 .25rem .5rem 0;font:inherit;white-space:pre-wrap;word-break:break-all;word-wrap:break-word;overflow-wrap:break-word;background:inherit;border:none;overflow:hidden}.content.resolved[data-v-3d625308]{opacity:.7}.content.resolved .resolvement-options[data-v-3d625308]{display:flex;align-items:center;margin-bottom:.25rem;font-size:.75rem}";
  styleInject(css_248z$c);

  /* script */
  var __vue_script__$g = script$g;
  /* template */

  var __vue_render__$g = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content",
      class: {
        resolved: _vm.isResolved
      }
    }, [_vm.isResolved ? _c('div', {
      staticClass: "resolvement-options"
    }, [_c('span', {
      staticClass: "font-italic mr-1"
    }, [_vm._v("Marked as resolved.")]), _vm._v(" "), _c('v-tooltip', {
      attrs: {
        "open-delay": "800",
        "right": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('v-btn', _vm._g({
            attrs: {
              "color": "secondary",
              "text": "",
              "x-small": ""
            },
            on: {
              "click": _vm.$listeners.unresolve
            }
          }, on), [_vm._v("\n          Undo\n        ")])];
        }
      }], null, false, 3181083862)
    }, [_vm._v(" "), _c('span', [_vm._v("Unresolve comment")])])], 1) : _vm._e(), _vm._v(" "), _c('pre', [_c('span', [_vm._v(_vm._s(_vm.content))]), _c('br')])]);
  };

  var __vue_staticRenderFns__$g = [];
  /* style */

  var __vue_inject_styles__$g = undefined;
  /* scoped */

  var __vue_scope_id__$g = "data-v-3d625308";
  /* functional template */

  var __vue_is_functional_template__$g = false;
  /* component normalizer */

  function __vue_normalize__$g(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "Preview.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var CommentPreview = __vue_normalize__$g({
    render: __vue_render__$g,
    staticRenderFns: __vue_staticRenderFns__$g
  }, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g);

  //
  var script$f = {
    name: 'thread-comment',
    props: {
      comment: {
        type: Object,
        required: true
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data(vm) {
      return {
        content: vm.comment.content,
        isEditing: false
      };
    },
    computed: {
      isResolved: function isResolved(_ref) {
        var comment = _ref.comment;
        return !!comment.resolvedAt;
      }
    },
    methods: {
      toggleEdit: function toggleEdit() {
        this.isEditing = !this.isEditing;
      },
      save: function save() {
        var comment = this.comment,
            content = this.content;
        if (!content) return this.remove();
        this.toggleEdit();
        this.$emit('update', comment, content);
      },
      remove: function remove() {
        this.$emit('remove', this.comment);
      },
      reset: function reset() {
        this.content = this.comment.content;
        this.isEditing = false;
      }
    },
    watch: {
      comment: {
        deep: true,
        handler: 'reset'
      }
    },
    components: {
      CommentHeader: CommentHeader,
      CommentPreview: CommentPreview
    }
  };

  var css_248z$b = ".comment[data-v-3d04e7dc]{display:flex;flex-direction:column;font-family:Roboto,Arial,sans-serif}.comment-body[data-v-3d04e7dc]{flex:1;padding:0 .25rem 0 2.625rem}.comment-editor.v-textarea[data-v-3d04e7dc]{margin:.75rem 0 0 0}.comment-editor.v-textarea[data-v-3d04e7dc]  .v-input__slot{width:auto}";
  styleInject(css_248z$b);

  /* script */
  var __vue_script__$f = script$f;
  /* template */

  var __vue_render__$f = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "comment"
    }, [_c('comment-header', _vm._b({
      on: {
        "toggleEdit": _vm.toggleEdit,
        "remove": _vm.remove,
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', _vm.comment);
        }
      }
    }, 'comment-header', {
      comment: _vm.comment,
      isActivityThread: _vm.isActivityThread,
      isResolved: _vm.isResolved,
      elementLabel: _vm.elementLabel,
      user: _vm.user
    }, false)), _vm._v(" "), _c('div', {
      staticClass: "comment-body"
    }, [!_vm.isEditing ? _c('comment-preview', _vm._b({
      on: {
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', _vm.comment);
        }
      }
    }, 'comment-preview', {
      content: _vm.content,
      isResolved: _vm.isResolved
    }, false)) : [_c('v-textarea', {
      staticClass: "comment-editor",
      attrs: {
        "rows": "3",
        "autofocus": "",
        "outlined": "",
        "auto-grow": "",
        "clearable": "",
        "counter": ""
      },
      model: {
        value: _vm.content,
        callback: function callback($$v) {
          _vm.content = typeof $$v === 'string' ? $$v.trim() : $$v;
        },
        expression: "content"
      }
    }), _vm._v(" "), _c('span', {
      staticClass: "d-flex justify-end"
    }, [_c('v-btn', {
      attrs: {
        "text": "",
        "small": ""
      },
      on: {
        "click": _vm.reset
      }
    }, [_vm._v("Cancel")]), _vm._v(" "), _c('v-btn', {
      attrs: {
        "color": "green",
        "text": "",
        "small": ""
      },
      on: {
        "click": _vm.save
      }
    }, [_c('v-icon', {
      staticClass: "pr-1"
    }, [_vm._v("mdi-check")]), _vm._v(" Save\n        ")], 1)], 1)]], 2)], 1);
  };

  var __vue_staticRenderFns__$f = [];
  /* style */

  var __vue_inject_styles__$f = undefined;
  /* scoped */

  var __vue_scope_id__$f = "data-v-3d04e7dc";
  /* functional template */

  var __vue_is_functional_template__$f = false;
  /* component normalizer */

  function __vue_normalize__$f(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ThreadComment = __vue_normalize__$f({
    render: __vue_render__$f,
    staticRenderFns: __vue_staticRenderFns__$f
  }, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f);

  //
  var script$e = {
    name: 'thread-list',
    inject: ['$teRegistry'],
    props: {
      comments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      elementLabel: {
        type: String,
        default: null
      },
      user: {
        type: Object,
        required: true
      }
    },
    methods: {
      getElementLabel: function getElementLabel(_ref) {
        var _find;

        var contentElement = _ref.contentElement;
        if (!contentElement) return;
        return (_find = find__default['default'](this.$teRegistry._registry, {
          type: contentElement.type
        })) === null || _find === void 0 ? void 0 : _find.name;
      }
    },
    components: {
      ThreadComment: ThreadComment
    }
  };

  var css_248z$a = ".thread-list[data-v-b5620cec]{margin:0;padding:0;list-style:none}.thread-list .thread-list-item .v-divider[data-v-b5620cec]{margin:0 .25rem 1rem .25rem}.thread-list .thread-list-item:first-child .v-divider[data-v-b5620cec]{display:none}";
  styleInject(css_248z$a);

  /* script */
  var __vue_script__$e = script$e;
  /* template */

  var __vue_render__$e = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('ul', {
      staticClass: "thread-list"
    }, _vm._l(_vm.comments, function (comment) {
      return _c('li', {
        key: comment.uid,
        staticClass: "thread-list-item"
      }, [_c('v-divider'), _vm._v(" "), _c('thread-comment', _vm._g(_vm._b({
        staticClass: "mb-3",
        attrs: {
          "element-label": _vm.getElementLabel(comment)
        }
      }, 'thread-comment', {
        comment: comment,
        isActivityThread: _vm.isActivityThread,
        user: _vm.user
      }, false), _vm.$listeners))], 1);
    }), 0);
  };

  var __vue_staticRenderFns__$e = [];
  /* style */

  var __vue_inject_styles__$e = undefined;
  /* scoped */

  var __vue_scope_id__$e = "data-v-b5620cec";
  /* functional template */

  var __vue_is_functional_template__$e = false;
  /* component normalizer */

  function __vue_normalize__$e(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "List.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ThreadList = __vue_normalize__$e({
    render: __vue_render__$e,
    staticRenderFns: __vue_staticRenderFns__$e
  }, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e);

  //
  var script$d = {
    name: 'unseen-divider',
    props: {
      count: {
        type: Number,
        required: true
      }
    },
    computed: {
      unseenCommentsLabel: function unseenCommentsLabel(_ref) {
        var count = _ref.count;
        return "".concat(count, " new ").concat(pluralize__default['default']('message', count));
      }
    }
  };

  var css_248z$9 = ".unseen-divider[data-v-221b9d72]{text-align:center}.unseen-divider .v-divider[data-v-221b9d72]{margin:1rem 0 .25rem}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip{margin:-1.5rem 0 .5rem 0;border-radius:1rem!important;background-color:#fafafa!important}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip .v-chip__content .v-chip__close{margin-top:.125rem;font-size:.75rem!important}";
  styleInject(css_248z$9);

  /* script */
  var __vue_script__$d = script$d;
  /* template */

  var __vue_render__$d = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "unseen-divider"
    }, [_c('v-divider'), _vm._v(" "), _c('v-chip', {
      attrs: {
        "close-icon": "mdi-close",
        "color": "teal accent-4",
        "outlined": "",
        "small": "",
        "close": ""
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('seen');
        },
        "click:close": function clickClose($event) {
          return _vm.$emit('seen');
        }
      }
    }, [_c('v-icon', {
      staticClass: "mr-1",
      attrs: {
        "size": "14"
      }
    }, [_vm._v("mdi-arrow-down")]), _vm._v(" "), _c('span', {
      staticClass: "mr-2"
    }, [_vm._v(_vm._s(_vm.unseenCommentsLabel))])], 1)], 1);
  };

  var __vue_staticRenderFns__$d = [];
  /* style */

  var __vue_inject_styles__$d = undefined;
  /* scoped */

  var __vue_scope_id__$d = "data-v-221b9d72";
  /* functional template */

  var __vue_is_functional_template__$d = false;
  /* component normalizer */

  function __vue_normalize__$d(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "UnseenDivider.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var UnseenDivider = __vue_normalize__$d({
    render: __vue_render__$d,
    staticRenderFns: __vue_staticRenderFns__$d
  }, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d);

  var script$c = {
    name: 'discussion-thread',
    props: {
      items: {
        type: Array,
        required: true
      },
      showAll: {
        type: Boolean,
        default: false
      },
      minDisplayed: {
        type: Number,
        default: 5
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      unseenCount: {
        type: Number,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        isVisible: false
      };
    },
    computed: {
      visibleComments: function visibleComments() {
        var items = this.items,
            minDisplayed = this.minDisplayed,
            showAll = this.showAll;
        var comments = showAll ? items : takeRgt__default['default'](items, minDisplayed);

        var _partition = partition__default['default'](comments, 'unseen'),
            _partition2 = _slicedToArray$1(_partition, 2),
            unseen = _partition2[0],
            seen = _partition2[1];

        return {
          seen: seen,
          unseen: unseen
        };
      }
    },
    methods: {
      onUpdate: function onUpdate(comment, content) {
        this.$emit('update', Object.assign({}, comment, {
          content: content
        }));
      },
      onIntersect: function onIntersect(_entries, _observer, isIntersected) {
        this.isVisible = isIntersected;
      },
      revealUnseen: function revealUnseen(count) {
        var $refs = this.$refs,
            minDisplayed = this.minDisplayed;
        if ((count || this.unseenCount) < minDisplayed) return;
        this.$emit('showAll', true);
        this.$nextTick(function () {
          var element = $refs.unseenDivider.$el;
          if (!element) return;
          element.scrollIntoView({
            behavior: 'smooth'
          });
        });
      },
      markSeen: function markSeen() {
        this.$emit('seen');
        this.$emit('showAll', false);
      }
    },
    watch: {
      isVisible: function isVisible(val) {
        if (!val || !this.unseenCount) return;
        this.revealUnseen();
      },
      unseenCount: {
        immediate: true,
        handler: 'revealUnseen'
      }
    },
    components: {
      UnseenDivider: UnseenDivider,
      ThreadList: ThreadList
    }
  };

  var css_248z$8 = ".discussion-thread[data-v-c6af8436]{width:100%}.discussion-thread.scroll-container[data-v-c6af8436]{max-height:31.25rem;overflow-y:scroll;overflow-x:hidden;padding-right:1.5rem;box-sizing:content-box}.discussion-thread .fade-enter-active[data-v-c6af8436],.discussion-thread .fade-leave-active[data-v-c6af8436]{transition:opacity .5s}.discussion-thread .fade-enter[data-v-c6af8436],.discussion-thread .fade-leave-to[data-v-c6af8436]{opacity:0}";
  styleInject(css_248z$8);

  /* script */
  var __vue_script__$c = script$c;
  /* template */

  var __vue_render__$c = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      directives: [{
        name: "intersect",
        rawName: "v-intersect",
        value: _vm.onIntersect,
        expression: "onIntersect"
      }],
      staticClass: "discussion-thread",
      class: {
        'scroll-container': !_vm.isActivityThread
      }
    }, [_c('thread-list', _vm._b({
      on: {
        "update": _vm.onUpdate,
        "remove": function remove($event) {
          return _vm.$emit('remove', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        }
      }
    }, 'thread-list', {
      isActivityThread: _vm.isActivityThread,
      user: _vm.user,
      comments: _vm.visibleComments.seen
    }, false)), _vm._v(" "), _c('transition', {
      attrs: {
        "name": "fade"
      }
    }, [_vm.unseenCount ? _c('unseen-divider', {
      ref: "unseenDivider",
      attrs: {
        "count": _vm.unseenCount
      },
      on: {
        "seen": _vm.markSeen
      }
    }) : _vm._e()], 1), _vm._v(" "), _c('thread-list', _vm._b({
      on: {
        "update": _vm.onUpdate,
        "remove": function remove($event) {
          return _vm.$emit('remove', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        }
      }
    }, 'thread-list', {
      isActivityThread: _vm.isActivityThread,
      user: _vm.user,
      comments: _vm.visibleComments.unseen
    }, false))], 1);
  };

  var __vue_staticRenderFns__$c = [];
  /* style */

  var __vue_inject_styles__$c = undefined;
  /* scoped */

  var __vue_scope_id__$c = "data-v-c6af8436";
  /* functional template */

  var __vue_is_functional_template__$c = false;
  /* component normalizer */

  function __vue_normalize__$c(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var DiscussionThread = __vue_normalize__$c({
    render: __vue_render__$c,
    staticRenderFns: __vue_staticRenderFns__$c
  }, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$b = {
    name: 'resolve-comments-btn'
  };

  /* script */
  var __vue_script__$b = script$b;
  /* template */

  var __vue_render__$b = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "resolve-btn-container"
    }, [_c('v-tooltip', {
      attrs: {
        "open-delay": "800",
        "left": ""
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var on = ref.on;
          return [_c('v-btn', _vm._g({
            staticClass: "px-1",
            attrs: {
              "color": "teal accent-4",
              "small": "",
              "text": ""
            }
          }, Object.assign({}, _vm.$listeners, on)), [_c('v-icon', {
            staticClass: "mr-2",
            attrs: {
              "size": "24",
              "color": "teal accent-4"
            }
          }, [_vm._v("\n          mdi-check-box-outline\n        ")]), _vm._v("\n        Resolve All\n      ")], 1)];
        }
      }])
    }, [_vm._v(" "), _c('span', [_vm._v("Mark all as resolved and hide discussion")])])], 1);
  };

  var __vue_staticRenderFns__$b = [];
  /* style */

  var __vue_inject_styles__$b = undefined;
  /* scoped */

  var __vue_scope_id__$b = undefined;
  /* functional template */

  var __vue_is_functional_template__$b = false;
  /* component normalizer */

  function __vue_normalize__$b(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ResolveButton.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ResolveButton = __vue_normalize__$b({
    render: __vue_render__$b,
    staticRenderFns: __vue_staticRenderFns__$b
  }, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b);

  //

  var initCommentInput = function initCommentInput() {
    return {
      content: ''
    };
  };

  var script$a = {
    name: 'tailor-embedded-discussion',
    inheritAttrs: true,
    props: {
      comments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      unseenComments: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      commentsShownLimit: {
        type: Number,
        default: 5
      },
      scrollTarget: {
        type: String,
        default: 'discussion'
      },
      showHeading: {
        type: Boolean,
        default: false
      },
      showNotifications: {
        type: Boolean,
        default: false
      },
      isActivityThread: {
        type: Boolean,
        default: false
      },
      hasUnresolvedComments: {
        type: Boolean,
        default: false
      },
      isVisible: {
        type: Boolean,
        default: false
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        showAll: false,
        comment: initCommentInput()
      };
    },
    computed: {
      thread: function thread() {
        var comments = this.comments,
            unseenComments = this.unseenComments;
        var processedThread = comments.map(function (comment) {
          var unseen = unseenComments.find(function (it) {
            return it.id === comment.id;
          });
          return Object.assign({}, comment, {
            unseen: !!unseen
          });
        });
        return orderBy__default['default'](processedThread, ['unseen', 'createdAt'], 'asc');
      },
      commentsCount: function commentsCount(vm) {
        return vm.thread.length;
      },
      hasHiddenComments: function hasHiddenComments(vm) {
        return vm.commentsShownLimit < vm.commentsCount;
      },
      isTextEditorEmpty: function isTextEditorEmpty(vm) {
        var _vm$comment$content;

        return !((_vm$comment$content = vm.comment.content) !== null && _vm$comment$content !== void 0 && _vm$comment$content.trim());
      },
      discussion: function discussion(vm) {
        return vm.$refs.discussion;
      },
      commentInput: function commentInput(vm) {
        return vm.$refs.commentInput;
      },
      showResolveButton: function showResolveButton(vm) {
        return vm.hasUnresolvedComments && !vm.isActivityThread;
      }
    },
    methods: Object.assign({}, vueRadio.mapRequests('app', ['showConfirmationModal']), {
      post: function post() {
        var _this = this;

        var scrollTarget = this.scrollTarget,
            comment = this.comment,
            author = this.user;
        if (!comment.content) return;
        var payload = {
          content: comment.content,
          author: author,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        this.comment = initCommentInput();
        this.$emit('save', payload); // Keep editor/discussion container inside viewport.

        var scrollOptions = {
          block: 'center',
          behavior: 'smooth'
        };
        this.$nextTick(function () {
          return _this[scrollTarget].scrollIntoView(scrollOptions);
        });
      },
      remove: function remove(comment) {
        var _this2 = this;

        this.showConfirmationModal(Object.assign({
          title: 'Remove comment',
          message: 'Are you sure you want to remove this comment?',
          action: function action() {
            return _this2.$emit('remove', comment);
          }
        }, this.onConfirmationActive()));
      },
      resolveAll: function resolveAll() {
        var _this3 = this;

        this.showConfirmationModal(Object.assign({
          title: 'Resolve all comments',
          message: 'Are you sure you want to resolve all comments?',
          action: function action() {
            return _this3.$emit('resolve');
          }
        }, this.onConfirmationActive()));
      },
      onConfirmationActive: function onConfirmationActive() {
        var _this4 = this;

        var onOpen = function onOpen() {
          return _this4.$emit('update:confirmationActive', true);
        };

        var onClose = function onClose() {
          return _this4.$emit('update:confirmationActive', false);
        };

        return {
          onOpen: onOpen,
          onClose: onClose
        };
      }
    }),
    watch: {
      commentsCount: function commentsCount() {
        this.$emit('change', this.thread);
      },
      isVisible: {
        immediate: true,
        handler: function handler(val) {
          var _this5 = this;

          if (!val && this.isActivityThread) return; // Focus editor manually with delay to avoid
          // element focus prioritization (e.g HTML element)

          setTimeout(function () {
            return _this5.commentInput.focus();
          }, 500);
        }
      }
    },
    created: function created() {
      this.comment = initCommentInput();
    },
    components: {
      DiscussionThread: DiscussionThread,
      ResolveButton: ResolveButton
    }
  };

  var css_248z$7 = ".embedded-discussion[data-v-8b85896c]{font-family:Roboto,Arial,sans-serif}.embedded-discussion .resolve-btn-container[data-v-8b85896c]{display:flex;justify-content:flex-end;margin:.5rem 0 0 0}.embedded-discussion .header[data-v-8b85896c]{margin:.875rem 0 1.625rem 0;font-size:1.125rem;font-weight:400}.embedded-discussion .comment-input[data-v-8b85896c]{margin:0 .25rem 0 .25rem}.embedded-discussion .alert[data-v-8b85896c]  .v-icon{color:var(--v-primary-darken2)!important}";
  styleInject(css_248z$7);

  /* script */
  var __vue_script__$a = script$a;
  /* template */

  var __vue_render__$a = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      ref: "discussion",
      staticClass: "embedded-discussion"
    }, [_vm.showResolveButton ? _c('resolve-button', {
      on: {
        "click": _vm.resolveAll
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      class: {
        'pb-7': !_vm.showHeading && _vm.hasHiddenComments
      }
    }, [_vm.hasHiddenComments ? _c('v-btn', {
      staticClass: "float-right mt-1",
      attrs: {
        "text": "",
        "x-small": ""
      },
      on: {
        "click": function click($event) {
          _vm.showAll = !_vm.showAll;
        }
      }
    }, [_vm._v("\n      Show " + _vm._s(_vm.showAll ? 'less' : 'more') + "\n    ")]) : _vm._e()], 1), _vm._v(" "), _vm.showHeading ? _c('div', {
      staticClass: "header d-flex grey--text text--darken-3"
    }, [_c('v-icon', {
      staticClass: "mr-2",
      attrs: {
        "color": "grey darken-3"
      }
    }, [_vm._v("\n      mdi-forum-outline\n    ")]), _vm._v("\n    Comments\n  ")], 1) : _vm._e(), _vm._v(" "), !_vm.commentsCount && _vm.showNotifications ? _c('v-alert', {
      staticClass: "alert",
      attrs: {
        "color": "primary lighten-5",
        "icon": "mdi-keyboard-outline",
        "prominent": ""
      }
    }, [_c('span', {
      staticClass: "px-1 subtitle-2"
    }, [_vm._v("\n      Be the First to Comment!\n    ")])]) : _vm._e(), _vm._v(" "), _vm.thread.length ? _c('discussion-thread', {
      staticClass: "mt-2",
      attrs: {
        "items": _vm.thread,
        "show-all": _vm.showAll,
        "min-displayed": _vm.commentsShownLimit,
        "is-activity-thread": _vm.isActivityThread,
        "unseen-count": _vm.unseenComments.length,
        "user": _vm.user
      },
      on: {
        "update": function update($event) {
          return _vm.$emit('update', $event);
        },
        "resolve": function resolve($event) {
          return _vm.$emit('resolve', $event);
        },
        "unresolve": function unresolve($event) {
          return _vm.$emit('unresolve', $event);
        },
        "seen": function seen($event) {
          return _vm.$emit('seen');
        },
        "remove": _vm.remove,
        "showAll": function showAll($event) {
          _vm.showAll = $event;
        }
      }
    }) : _vm._e(), _vm._v(" "), _c('div', {
      staticClass: "text-right"
    }, [_c('v-textarea', {
      ref: "commentInput",
      staticClass: "comment-input",
      attrs: {
        "placeholder": _vm.commentsCount ? 'Add a comment...' : 'Start the discussion...',
        "rows": "3",
        "outlined": "",
        "auto-grow": "",
        "clearable": "",
        "counter": ""
      },
      on: {
        "focus": function focus($event) {
          return _vm.$emit('seen');
        }
      },
      model: {
        value: _vm.comment.content,
        callback: function callback($$v) {
          _vm.$set(_vm.comment, "content", typeof $$v === 'string' ? $$v.trim() : $$v);
        },
        expression: "comment.content"
      }
    }), _vm._v(" "), _c('v-btn', {
      attrs: {
        "disabled": _vm.isTextEditorEmpty,
        "icon": ""
      },
      on: {
        "click": _vm.post
      }
    }, [_c('v-icon', [_vm._v("mdi-send")])], 1)], 1)], 1);
  };

  var __vue_staticRenderFns__$a = [];
  /* style */

  var __vue_inject_styles__$a = undefined;
  /* scoped */

  var __vue_scope_id__$a = "data-v-8b85896c";
  /* functional template */

  var __vue_is_functional_template__$a = false;
  /* component normalizer */

  function __vue_normalize__$a(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "index.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var Discussion$1 = __vue_normalize__$a({
    render: __vue_render__$a,
    staticRenderFns: __vue_staticRenderFns__$a
  }, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a);

  //

  var getActivatorOptions = function getActivatorOptions(unseenComments) {
    return {
      unseen: {
        class: 'teal accent-4 white--text',
        tooltip: 'View new comments',
        text: unseenComments.length
      },
      preview: {
        icon: 'mdi-comment-text-multiple-outline',
        color: 'primary darken-4',
        tooltip: 'View comments'
      },
      post: {
        icon: 'mdi-message-plus-outline',
        color: 'primary darken-4',
        tooltip: 'Post a comment'
      }
    };
  };

  var script$9 = {
    name: 'tailor-element-discussion',
    props: {
      id: {
        type: Number,
        default: null
      },
      uid: {
        type: String,
        required: true
      },
      comments: {
        type: Array,
        required: true
      },
      hasUnresolvedComments: {
        type: Boolean,
        default: false
      },
      lastSeen: {
        type: Number,
        required: true
      },
      user: {
        type: Object,
        required: true
      }
    },
    data: function data() {
      return {
        isVisible: false,
        isConfirmationActive: false
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorBus: 'editor'
    }), {
      events: function events() {
        return utils.Events.Discussion;
      },
      lastCommentAt: function lastCommentAt(vm) {
        return new Date(get__default['default'](vm.comments[0], 'createdAt', 0)).getTime();
      },
      unseenComments: function unseenComments() {
        var comments = this.comments,
            user = this.user,
            lastSeen = this.lastSeen;
        return comments.filter(function (it) {
          var createdAt = new Date(it.createdAt).getTime();
          return it.author.id !== user.id && createdAt > lastSeen;
        });
      },
      activator: function activator() {
        var comments = this.comments,
            unseenComments = this.unseenComments;
        var type = unseenComments.length ? 'unseen' : comments.length ? 'preview' : 'post';
        return getActivatorOptions(unseenComments)[type];
      }
    }),
    methods: {
      save: function save(data) {
        var author = this.user,
            elementId = this.id,
            hasUnresolvedComments = this.hasUnresolvedComments;
        return this.editorBus.emit(utils.Events.Discussion.SAVE, Object.assign({}, data, {
          author: author,
          contentElementId: elementId,
          hasUnresolvedComments: hasUnresolvedComments
        }));
      },
      setLastSeen: function setLastSeen(timeout) {
        var elementUid = this.uid,
            lastCommentAt = this.lastCommentAt,
            events = this.events;
        var options = {
          elementUid: elementUid,
          lastCommentAt: lastCommentAt,
          timeout: timeout
        };
        this.editorBus.emit(events.SET_LAST_SEEN, options);
      },
      resolve: function resolve() {
        var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
            id = _ref.id,
            resolvedAt = _ref.resolvedAt;

        var contentElementId = this.id,
            events = this.events;
        this.editorBus.emit(events.RESOLVE, {
          id: id,
          contentElementId: contentElementId,
          resolvedAt: resolvedAt
        });
      }
    },
    watch: {
      isVisible: function isVisible(val) {
        this.$emit(val ? 'open' : 'close');
      }
    },
    components: {
      Discussion: Discussion$1
    }
  };

  var css_248z$6 = "[data-v-7be6d374] .v-menu__content{background:#fff}[data-v-7be6d374] .v-menu__content .embedded-discussion{text-align:left}[data-v-7be6d374] .v-menu__content .comment .author{font-size:.875rem}.unseen[data-v-7be6d374]{font-size:.75rem}";
  styleInject(css_248z$6);

  /* script */
  var __vue_script__$9 = script$9;
  /* template */

  var __vue_render__$9 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-menu', {
      attrs: {
        "close-on-content-click": false,
        "close-on-click": !_vm.isConfirmationActive,
        "min-width": "300",
        "transition": "slide-y-transition",
        "left": "",
        "offset-y": "",
        "attach": ""
      },
      nativeOn: {
        "click": function click($event) {
          $event.stopPropagation();
        }
      },
      scopedSlots: _vm._u([{
        key: "activator",
        fn: function fn(ref) {
          var menu = ref.on;
          return [_c('v-tooltip', {
            attrs: {
              "open-delay": "800",
              "left": ""
            },
            scopedSlots: _vm._u([{
              key: "activator",
              fn: function fn(ref) {
                var tooltip = ref.on;
                return [_c('v-btn', _vm._g({
                  class: _vm.activator.class,
                  attrs: {
                    "x-small": "",
                    "icon": ""
                  }
                }, Object.assign({}, menu, tooltip)), [_vm.activator.text ? _c('div', {
                  staticClass: "unseen"
                }, [_vm._v(_vm._s(_vm.activator.text))]) : _c('v-icon', {
                  attrs: {
                    "color": _vm.activator.color,
                    "size": "18"
                  }
                }, [_vm._v("\n            " + _vm._s(_vm.activator.icon) + "\n          ")])], 1)];
              }
            }], null, true)
          }, [_vm._v(" "), _c('span', [_vm._v(_vm._s(_vm.activator.tooltip))])])];
        }
      }]),
      model: {
        value: _vm.isVisible,
        callback: function callback($$v) {
          _vm.isVisible = $$v;
        },
        expression: "isVisible"
      }
    }, [_vm._v(" "), _c('discussion', _vm._b({
      staticClass: "pa-2",
      attrs: {
        "confirmation-active": _vm.isConfirmationActive
      },
      on: {
        "save": _vm.save,
        "update": _vm.save,
        "remove": function remove($event) {
          return _vm.editorBus.emit(_vm.events.REMOVE, $event);
        },
        "seen": _vm.setLastSeen,
        "resolve": _vm.resolve,
        "update:confirmationActive": function updateConfirmationActive($event) {
          _vm.isConfirmationActive = $event;
        },
        "update:confirmation-active": function updateConfirmationActive($event) {
          _vm.isConfirmationActive = $event;
        }
      }
    }, 'discussion', {
      comments: _vm.comments,
      unseenComments: _vm.unseenComments,
      hasUnresolvedComments: _vm.hasUnresolvedComments,
      user: _vm.user,
      isVisible: _vm.isVisible
    }, false))], 1);
  };

  var __vue_staticRenderFns__$9 = [];
  /* style */

  var __vue_inject_styles__$9 = undefined;
  /* scoped */

  var __vue_scope_id__$9 = "data-v-7be6d374";
  /* functional template */

  var __vue_is_functional_template__$9 = false;
  /* component normalizer */

  function __vue_normalize__$9(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementDiscussion.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var Discussion = __vue_normalize__$9({
    render: __vue_render__$9,
    staticRenderFns: __vue_staticRenderFns__$9
  }, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9);

  //
  var script$8 = {
    name: 'tailor-publish-diff-chip',
    props: {
      changeType: {
        validator: function validator(value) {
          if (!value) return true;
          return Object.values(utils.publishDiffChangeTypes).includes(value);
        },
        default: null
      }
    }
  };

  /* script */
  var __vue_script__$8 = script$8;
  /* template */

  var __vue_render__$8 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _vm.changeType ? _c('v-chip', {
      staticClass: "readonly font-weight-medium text-capitalize",
      attrs: {
        "text-color": _vm.changeType === 'new' ? 'success' : 'secondary',
        "color": "primary lighten-5",
        "small": "",
        "round": ""
      }
    }, [_vm._v("\n  " + _vm._s(_vm.changeType) + "\n")]) : _vm._e();
  };

  var __vue_staticRenderFns__$8 = [];
  /* style */

  var __vue_inject_styles__$8 = undefined;
  /* scoped */

  var __vue_scope_id__$8 = undefined;
  /* functional template */

  var __vue_is_functional_template__$8 = false;
  /* component normalizer */

  function __vue_normalize__$8(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "PublishDiffChip.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var PublishDiffChip = __vue_normalize__$8({
    render: __vue_render__$8,
    staticRenderFns: __vue_staticRenderFns__$8
  }, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8);

  //
  var script$7 = {
    name: 'tailor-content-element',
    inject: {
      $getCurrentUser: {},
      $editorState: {
        default: {}
      }
    },
    inheritAttrs: false,
    props: {
      element: {
        type: Object,
        required: true
      },
      parent: {
        type: Object,
        default: null
      },
      isHovered: {
        type: Boolean,
        default: false
      },
      isDragged: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      frame: {
        type: Boolean,
        default: true
      },
      dense: {
        type: Boolean,
        default: false
      },
      showDiscussion: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        isFocused: false,
        isSaving: false,
        activeUsers: []
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorBus: 'editor'
    }), {
      id: function id(vm) {
        return utils.getElementId(vm.element);
      },
      componentName: function componentName(vm) {
        return utils.getComponentName(vm.element.type);
      },
      isEmbed: function isEmbed(vm) {
        return !!vm.parent || !vm.element.uid;
      },
      isHighlighted: function isHighlighted(vm) {
        return vm.isFocused || vm.isHovered;
      },
      hasComments: function hasComments(vm) {
        var _vm$element$comments;

        return !!((_vm$element$comments = vm.element.comments) !== null && _vm$element$comments !== void 0 && _vm$element$comments.length);
      },
      elementBus: function elementBus(vm) {
        return vm.$radio.channel("element:".concat(vm.id));
      },
      currentUser: function currentUser(vm) {
        return vm.$getCurrentUser();
      }
    }),
    methods: {
      onSelect: function onSelect(e) {
        if (this.isDisabled || this.$editorState.isPublishDiff || e.component) return;
        this.focus();
        e.component = {
          name: 'content-element',
          data: this.element
        };
      },
      onSave: function onSave(data) {
        if (!this.isEmbed) this.isSaving = true;
        this.$emit('save', data);
      },
      focus: function focus() {
        this.editorBus.emit('element:focus', this.element, this.parent);
      }
    },
    created: function created() {
      var _this = this;

      var deferSaveFlag = function deferSaveFlag() {
        return setTimeout(function () {
          return _this.isSaving = false;
        }, 1000);
      }; // Element listeners


      this.elementBus.on('delete', function () {
        return _this.$emit('delete');
      });
      this.elementBus.on('save:meta', function (meta) {
        return _this.$emit('save:meta', meta);
      });
      this.elementBus.on('saved', deferSaveFlag); // Editor listeners

      this.editorBus.on('element:select', function (_ref) {
        var elementId = _ref.elementId,
            _ref$isSelected = _ref.isSelected,
            isSelected = _ref$isSelected === void 0 ? true : _ref$isSelected,
            user = _ref.user;
        if (_this.id !== elementId) return; // If current user; focus element

        if (!user || user.id === _this.currentUser.id) {
          _this.isFocused = isSelected;
          if (isSelected) _this.focus();
          return;
        } // If other user, toggle within active users list


        if (isSelected && !_this.activeUsers.find(function (it) {
          return it.id === user.id;
        })) {
          _this.activeUsers.push(user);
        } else if (!isSelected && _this.activeUsers.find(function (it) {
          return it.id === user.id;
        })) {
          _this.activeUsers = _this.activeUsers.filter(function (it) {
            return it.id !== user.id;
          });
        }
      });
      this.editorBus.on('element:focus', function (element) {
        _this.isFocused = !!element && utils.getElementId(element) === _this.id;
      });
    },
    provide: function provide() {
      return {
        $elementBus: this.elementBus
      };
    },
    components: {
      ActiveUsers: ActiveUsers$1,
      Discussion: Discussion,
      PublishDiffChip: PublishDiffChip
    }
  };

  var css_248z$5 = ".content-element[data-v-56cb794a]{position:relative;border:1px solid transparent}.content-element[data-v-56cb794a]::after{content:'';display:none;position:absolute;top:0;right:-.125rem;width:.125rem;height:100%}.content-element.focused[data-v-56cb794a]{border:1px dashed #1de9b6}.content-element.focused[data-v-56cb794a]::after{display:block;background:#1de9b6}.content-element.selected[data-v-56cb794a]{border:1px dashed #ff4081}.content-element.selected[data-v-56cb794a]::after{display:block;background:#ff4081}.frame[data-v-56cb794a]{padding:10px 20px;border:1px solid #e1e1e1}.element-actions[data-v-56cb794a]{display:flex;flex-direction:column;position:absolute;top:-.0625rem;right:-1.25rem;width:1.5rem;height:100%;padding-left:.75rem}.element-actions>*[data-v-56cb794a]{min-height:1.75rem;opacity:0;transition:opacity .1s linear}.element-actions>.is-visible[data-v-56cb794a]{opacity:1;transition:opacity .5s linear}.active-users[data-v-56cb794a]{position:absolute;top:0;left:-1.625rem}.save-indicator[data-v-56cb794a]{position:absolute;bottom:-.125rem;left:0}.header[data-v-56cb794a]{width:100%;max-height:0}.header.visible[data-v-56cb794a]{max-height:unset;padding:0 0 .5rem}.diff.new[data-v-56cb794a]{border:none;box-shadow:0 0 0 2px var(--v-success-lighten2)!important}.diff.changed[data-v-56cb794a],.diff.removed[data-v-56cb794a]{border:none;box-shadow:0 0 0 2px var(--v-secondary-lighten4)!important}.diff .element-actions[data-v-56cb794a]{display:none}";
  styleInject(css_248z$5);

  /* script */
  var __vue_script__$7 = script$7;
  /* template */

  var __vue_render__$7 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "content-element",
      class: [_vm.element.changeSincePublish, {
        selected: _vm.activeUsers.length,
        focused: _vm.isFocused,
        diff: _vm.$editorState.isPublishDiff,
        frame: _vm.frame
      }],
      on: {
        "click": _vm.onSelect
      }
    }, [_c('div', {
      staticClass: "header d-flex",
      class: {
        visible: _vm.$editorState.isPublishDiff && _vm.element.changeSincePublish
      }
    }, [_c('publish-diff-chip', {
      staticClass: "ml-auto ",
      attrs: {
        "change-type": _vm.element.changeSincePublish
      }
    })], 1), _vm._v(" "), _c('active-users', {
      staticClass: "active-users",
      attrs: {
        "users": _vm.activeUsers,
        "size": 20
      }
    }), _vm._v(" "), _c(_vm.componentName, _vm._b({
      tag: "component",
      attrs: {
        "id": "element_" + _vm.id
      },
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        },
        "save": _vm.onSave,
        "delete": function _delete($event) {
          return _vm.$emit('delete');
        },
        "focus": _vm.onSelect
      }
    }, 'component', Object.assign({}, _vm.$attrs, {
      element: _vm.element,
      isFocused: _vm.isFocused,
      isDragged: _vm.isDragged,
      isDisabled: _vm.isDisabled,
      dense: _vm.dense
    }), false)), _vm._v(" "), !_vm.isDisabled ? _c('div', {
      staticClass: "element-actions"
    }, [_vm.showDiscussion ? _c('div', {
      class: {
        'is-visible': _vm.isHighlighted || _vm.hasComments
      }
    }, [_c('discussion', _vm._b({
      attrs: {
        "user": _vm.currentUser
      },
      on: {
        "open": _vm.focus,
        "close": function close($event) {
          _vm.isFocused = false;
        }
      }
    }, 'discussion', _vm.element, false))], 1) : _vm._e(), _vm._v(" "), !_vm.parent ? _c('div', {
      class: {
        'is-visible': _vm.isHighlighted
      }
    }, [_c('v-btn', {
      attrs: {
        "color": "pink lighten-1",
        "dark": "",
        "icon": "",
        "x-small": ""
      },
      on: {
        "click": function click($event) {
          return _vm.$emit('delete');
        }
      }
    }, [_c('v-icon', {
      attrs: {
        "size": "20"
      }
    }, [_vm._v("mdi-delete-outline")])], 1)], 1) : _vm._e()]) : _vm._e(), _vm._v(" "), _vm.isSaving ? _c('v-progress-linear', {
      staticClass: "save-indicator",
      attrs: {
        "height": "2",
        "color": "teal accent-2",
        "indeterminate": ""
      }
    }) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$7 = [];
  /* style */

  var __vue_inject_styles__$7 = undefined;
  /* scoped */

  var __vue_scope_id__$7 = "data-v-56cb794a";
  /* functional template */

  var __vue_is_functional_template__$7 = false;
  /* component normalizer */

  function __vue_normalize__$7(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ContentElement.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContentElement = __vue_normalize__$7({
    render: __vue_render__$7,
    staticRenderFns: __vue_staticRenderFns__$7
  }, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7);

  //
  var script$6 = {
    name: 'tailor-contained-content',
    inheritAttrs: false,
    props: {
      element: {
        type: Object,
        required: true
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isDragged: {
        type: Boolean,
        default: false
      },
      setWidth: {
        type: Boolean,
        default: true
      },
      dense: {
        type: Boolean,
        default: false
      }
    },
    data: function data() {
      return {
        isHovered: false
      };
    },
    computed: {
      bindings: function bindings() {
        var element = this.element,
            isDisabled = this.isDisabled,
            isDragged = this.isDragged,
            isHovered = this.isHovered,
            dense = this.dense,
            attrs = this.$attrs;
        return Object.assign({
          element: element,
          isDisabled: isDisabled,
          isDragged: isDragged,
          isHovered: isHovered,
          dense: dense
        }, attrs);
      },
      widthClass: function widthClass() {
        var element = this.element,
            setWidth = this.setWidth;
        return setWidth ? "col-xs-".concat(get__default['default'](element, 'data.width', 12)) : '';
      }
    },
    methods: {
      scrollContainer: throttle__default['default'](function (e) {
        var scrollUp = e.y < 200;
        var scrollDown = e.y > window.innerHeight - 200;
        if (scrollUp || scrollDown) window.scrollBy(0, scrollUp ? -30 : 30);
      }, 20)
    },
    components: {
      ContentElement: ContentElement
    }
  };

  var css_248z$4 = ".drag-handle[data-v-cb586726]{position:absolute;left:-3px;z-index:2;width:26px;opacity:0}.drag-handle .mdi[data-v-cb586726]{color:#888;font-size:28px}.hovered .drag-handle[data-v-cb586726]{opacity:1;transition:opacity .6s ease-in-out;cursor:pointer}.disabled .drag-handle[data-v-cb586726]{display:none}.contained-content[data-v-cb586726]{position:relative;margin:7px 0;padding:0}";
  styleInject(css_248z$4);

  /* script */
  var __vue_script__$6 = script$6;
  /* template */

  var __vue_render__$6 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "contained-content",
      class: [_vm.widthClass, {
        disabled: _vm.isDisabled,
        hovered: _vm.isHovered
      }],
      on: {
        "mouseover": function mouseover($event) {
          _vm.isHovered = true;
        },
        "mouseleave": function mouseleave($event) {
          _vm.isHovered = false;
        },
        "dragstart": function dragstart($event) {
          return _vm.$emit('dragstart');
        },
        "dragend": function dragend($event) {
          return _vm.$emit('dragend');
        },
        "dragover": _vm.scrollContainer
      }
    }, [!_vm.isDisabled ? _c('span', {
      staticClass: "drag-handle"
    }, [_c('span', {
      staticClass: "mdi mdi-drag-vertical"
    })]) : _vm._e(), _vm._v(" "), _c('content-element', _vm._b({
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        },
        "save": function save($event) {
          return _vm.$emit('save', $event);
        },
        "save:meta": function saveMeta($event) {
          return _vm.$emit('save:meta', $event);
        },
        "delete": function _delete($event) {
          return _vm.$emit('delete');
        }
      }
    }, 'content-element', _vm.bindings, false))], 1);
  };

  var __vue_staticRenderFns__$6 = [];
  /* style */

  var __vue_inject_styles__$6 = undefined;
  /* scoped */

  var __vue_scope_id__$6 = "data-v-cb586726";
  /* functional template */

  var __vue_is_functional_template__$6 = false;
  /* component normalizer */

  function __vue_normalize__$6(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ContainedContent.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ContainedContent = __vue_normalize__$6({
    render: __vue_render__$6,
    staticRenderFns: __vue_staticRenderFns__$6
  }, __vue_inject_styles__$6, __vue_script__$6, __vue_scope_id__$6, __vue_is_functional_template__$6);

  //
  var CE_FOCUS_EVENT = 'element:focus';
  var script$5 = {
    name: 'tailor-element-list',
    props: {
      elements: {
        type: Array,
        default: function _default() {
          return [];
        }
      },
      dragOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      supportedTypes: {
        type: Array,
        default: null
      },
      activity: {
        type: Object,
        default: null
      },
      layout: {
        type: Boolean,
        default: false
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      enableAdd: {
        type: Boolean,
        default: true
      },
      addElementOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      }
    },
    data: function data() {
      return {
        dragElementIndex: null
      };
    },
    computed: Object.assign({}, vueRadio.mapChannels({
      editorChannel: 'editor'
    }), {
      options: function options(vm) {
        return Object.assign({}, vm.dragOptions, {
          handle: '.drag-handle'
        });
      }
    }),
    methods: {
      get: get__default['default'],
      getElementId: utils.getElementId,
      onDragStart: function onDragStart(index) {
        this.dragElementIndex = index;
        this.editorChannel.emit(CE_FOCUS_EVENT);
      },
      onDragEnd: function onDragEnd(element) {
        this.dragElementIndex = -1;
        this.editorChannel.emit(CE_FOCUS_EVENT, element);
      },
      reorder: function reorder(_ref) {
        var newPosition = _ref.newIndex;
        var items = this.elements;
        this.$emit('update', {
          newPosition: newPosition,
          items: items
        });
      }
    },
    components: {
      AddElement: AddElement,
      Draggable: Draggable__default['default']
    }
  };

  var css_248z$3 = ".list-group[data-v-f18f3e56]{padding:.625rem 1.5rem}[data-v-f18f3e56] .sortable-ghost .drag-handle{display:none}[data-v-f18f3e56] .sortable-ghost .content-element{max-height:9.375rem;background:#f4f5f5}[data-v-f18f3e56] .sortable-ghost .content-element>*{visibility:hidden}[data-v-f18f3e56] .sortable-drag .content-element{max-height:auto;background:#fff}";
  styleInject(css_248z$3);

  /* script */
  var __vue_script__$5 = script$5;
  /* template */

  var __vue_render__$5 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('div', {
      staticClass: "list-group"
    }, [_c('draggable', _vm._b({
      staticClass: "row",
      attrs: {
        "list": _vm.elements,
        "disabled": _vm.isDisabled
      },
      on: {
        "start": function start($event) {
          _vm.dragElementIndex = $event.oldIndex;
        },
        "end": function end($event) {
          _vm.dragElementIndex = -1;
        },
        "update": _vm.reorder
      }
    }, 'draggable', _vm.options, false), _vm._l(_vm.elements, function (element, index) {
      return _c('div', {
        key: _vm.getElementId(element),
        staticClass: "pr-5",
        class: "col-xs-" + _vm.get(element, 'data.width', 12),
        on: {
          "dragstart": function dragstart($event) {
            return _vm.onDragStart(index);
          },
          "dragend": function dragend($event) {
            return _vm.onDragEnd(element);
          }
        }
      }, [_vm._t("list-item", null, {
        "element": element,
        "isDragged": _vm.dragElementIndex === index,
        "position": index
      })], 2);
    }), 0), _vm._v(" "), _vm.enableAdd && !_vm.isDisabled ? [_vm._t("list-add", [_c('add-element', {
      staticClass: "mt-1",
      attrs: {
        "items": _vm.elements,
        "include": _vm.supportedTypes,
        "activity": _vm.activity,
        "label": _vm.addElementOptions.label,
        "large": _vm.addElementOptions.large,
        "position": _vm.elements.length,
        "layout": _vm.layout
      },
      on: {
        "add": function add($event) {
          return _vm.$emit('add', $event);
        }
      }
    })], {
      "include": _vm.supportedTypes,
      "activity": _vm.activity,
      "position": _vm.elements.length,
      "layout": _vm.layout
    })] : _vm._e()], 2);
  };

  var __vue_staticRenderFns__$5 = [];
  /* style */

  var __vue_inject_styles__$5 = undefined;
  /* scoped */

  var __vue_scope_id__$5 = "data-v-f18f3e56";
  /* functional template */

  var __vue_is_functional_template__$5 = false;
  /* component normalizer */

  function __vue_normalize__$5(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementList.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ElementList = __vue_normalize__$5({
    render: __vue_render__$5,
    staticRenderFns: __vue_staticRenderFns__$5
  }, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$4 = {
    name: 'tailor-element-placeholder',
    props: {
      name: {
        type: String,
        required: true
      },
      icon: {
        type: String,
        required: true
      },
      placeholder: {
        type: String,
        default: 'Select to edit'
      },
      activePlaceholder: {
        type: String,
        default: 'Use toolbar to edit'
      },
      activeIcon: {
        type: String,
        default: null
      },
      activeColor: {
        type: String,
        default: '#fff'
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      isFocused: {
        type: Boolean,
        default: false
      },
      dense: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      iconSize: function iconSize() {
        if (this.dense) return this.isFocused ? 24 : 20;
        return this.isFocused ? 38 : 30;
      }
    }
  };

  /* script */
  var __vue_script__$4 = script$4;
  /* template */

  var __vue_render__$4 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-sheet', {
      staticClass: "transparent grey--text text--darken-4",
      class: _vm.dense ? 'pt-3' : 'pa-12'
    }, [_c('v-avatar', {
      attrs: {
        "size": _vm.dense ? 40 : 60,
        "color": _vm.isDisabled ? 'grey darken-3' : 'primary darken-4'
      }
    }, [_c('v-icon', {
      attrs: {
        "size": _vm.iconSize,
        "color": _vm.isFocused ? _vm.activeColor : '#fff'
      }
    }, [_vm._v("\n      " + _vm._s(_vm.icon) + "\n    ")])], 1), _vm._v(" "), _c('div', {
      staticClass: "grey--text",
      class: [_vm.isDisabled ? 'text--darken-3' : 'text--darken-4', _vm.dense ? 'my-2 subtitle-2' : 'my-4 headline']
    }, [_vm._v("\n    " + _vm._s(_vm.name) + "\n  ")]), _vm._v(" "), !_vm.dense && !_vm.isDisabled ? _c('div', {
      staticClass: "subtitle-1"
    }, [!_vm.isFocused ? [_vm._v(_vm._s(_vm.placeholder))] : [_c('span', [_vm._v(_vm._s(_vm.activePlaceholder))]), _vm._v(" "), _vm.activeIcon ? _c('v-icon', {
      attrs: {
        "size": "20",
        "color": "primary darken-4"
      }
    }, [_vm._v("\n        " + _vm._s(_vm.activeIcon) + "\n      ")]) : _vm._e()]], 2) : _vm._e()], 1);
  };

  var __vue_staticRenderFns__$4 = [];
  /* style */

  var __vue_inject_styles__$4 = undefined;
  /* scoped */

  var __vue_scope_id__$4 = undefined;
  /* functional template */

  var __vue_is_functional_template__$4 = false;
  /* component normalizer */

  function __vue_normalize__$4(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "ElementPlaceholder.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var ElementPlaceholder = __vue_normalize__$4({
    render: __vue_render__$4,
    staticRenderFns: __vue_staticRenderFns__$4
  }, __vue_inject_styles__$4, __vue_script__$4, __vue_scope_id__$4, __vue_is_functional_template__$4);

  var script$3 = {
    name: 'tailor-embedded-container',
    inheritAttrs: false,
    props: {
      container: {
        type: Object,
        required: true
      },
      types: {
        type: Array,
        default: function _default() {
          return ['JODIT_HTML', 'IMAGE', 'HTML', 'VIDEO'];
        }
      },
      isDisabled: {
        type: Boolean,
        default: false
      },
      addElementOptions: {
        type: Object,
        default: function _default() {
          return {};
        }
      },
      enableAdd: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      embeds: function embeds() {
        var items = this.container.embeds;
        return items ? values__default['default'](items).sort(function (a, b) {
          return a.position - b.position;
        }) : [];
      }
    },
    methods: Object.assign({}, vueRadio.mapRequests('app', ['showConfirmationModal']), {
      addItems: function addItems(items) {
        items = Array.isArray(items) ? items : [items];
        var container = cloneDeep__default['default'](this.container);
        container.embeds = Object.assign({}, container.embeds, mapKeys__default['default'](items, 'id'));
        this.$emit('save', container);
      },
      reorderItem: function reorderItem(_ref) {
        var newPosition = _ref.newPosition,
            items = _ref.items;
        var context = {
          items: items,
          newPosition: newPosition
        };
        var container = cloneDeep__default['default'](this.container);
        var reordered = container.embeds[items[newPosition].id];
        reordered.position = utils.calculatePosition(context);
        this.$emit('save', container);
      },
      save: function save(item, key, value) {
        var container = cloneDeep__default['default'](this.container);
        container.embeds[item.id] = Object.assign({}, item, _defineProperty$1({}, key, value));
        this.$emit('save', container);
      },
      requestDeleteConfirmation: function requestDeleteConfirmation(element) {
        var _this = this;

        this.showConfirmationModal({
          title: 'Delete element?',
          message: 'Are you sure you want to delete element?',
          action: function action() {
            return _this.$emit('delete', element);
          }
        });
      }
    }),
    components: {
      ContainedContent: ContainedContent,
      ElementList: ElementList
    }
  };

  /* script */
  var __vue_script__$3 = script$3;
  /* template */

  var __vue_render__$3 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('element-list', {
      attrs: {
        "add-element-options": _vm.addElementOptions,
        "elements": _vm.embeds,
        "supported-types": _vm.types,
        "enable-add": !_vm.isDisabled && _vm.enableAdd
      },
      on: {
        "add": _vm.addItems,
        "update": _vm.reorderItem
      },
      scopedSlots: _vm._u([{
        key: "list-item",
        fn: function fn(ref) {
          var element = ref.element;
          var isDragged = ref.isDragged;
          return [_c('contained-content', _vm._b({
            staticClass: "my-2",
            attrs: {
              "element": element,
              "is-dragged": isDragged,
              "is-disabled": _vm.isDisabled
            },
            on: {
              "save": function save($event) {
                return _vm.save(element, 'data', $event);
              },
              "save:meta": function saveMeta($event) {
                return _vm.save(element, 'meta', $event);
              },
              "delete": function _delete($event) {
                return _vm.requestDeleteConfirmation(element);
              }
            }
          }, 'contained-content', _vm.$attrs, false))];
        }
      }])
    });
  };

  var __vue_staticRenderFns__$3 = [];
  /* style */

  var __vue_inject_styles__$3 = undefined;
  /* scoped */

  var __vue_scope_id__$3 = undefined;
  /* functional template */

  var __vue_is_functional_template__$3 = false;
  /* component normalizer */

  function __vue_normalize__$3(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "EmbeddedContainer.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var EmbeddedContainer = __vue_normalize__$3({
    render: __vue_render__$3,
    staticRenderFns: __vue_staticRenderFns__$3
  }, __vue_inject_styles__$3, __vue_script__$3, __vue_scope_id__$3, __vue_is_functional_template__$3);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script$2 = {
    name: 'tailor-inline-activator',
    inheritAttrs: false,
    props: {
      disabled: {
        type: Boolean,
        required: false
      }
    }
  };

  var css_248z$2 = ".default-activator-state[data-v-64eb8c58],.inline-activator[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{padding:0 3.125rem;opacity:0}.inline-activator[data-v-64eb8c58]{display:flex;align-items:center;width:100%;margin:0;padding:0 3.125rem;opacity:0;transition:opacity .3s,padding .3s}.inline-activator[data-v-64eb8c58],.inline-activator .v-chip[data-v-64eb8c58]{cursor:pointer}.inline-activator hr[data-v-64eb8c58]{flex:1;display:inline-flex;margin:0;border-top:.0625rem dashed var(--v-primary-darken3)}.inline-activator[data-v-64eb8c58]:focus,.inline-activator[data-v-64eb8c58]:hover{padding:.75rem 0;opacity:1;outline:0;transition:opacity .3s .25s,padding .3s .1s}.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{pointer-events:none}";
  styleInject(css_248z$2);

  /* script */
  var __vue_script__$2 = script$2;
  /* template */

  var __vue_render__$2 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('button', _vm._g({
      staticClass: "inline-activator",
      class: {
        disabled: _vm.disabled
      }
    }, _vm.$listeners), [_c('hr'), _vm._v(" "), _c('v-avatar', {
      attrs: {
        "size": "20",
        "color": "primary darken-4"
      }
    }, [_c('v-icon', {
      attrs: {
        "size": "16",
        "dark": ""
      }
    }, [_vm._v("mdi-plus")])], 1), _vm._v(" "), _c('hr')], 1);
  };

  var __vue_staticRenderFns__$2 = [];
  /* style */

  var __vue_inject_styles__$2 = undefined;
  /* scoped */

  var __vue_scope_id__$2 = "data-v-64eb8c58";
  /* functional template */

  var __vue_is_functional_template__$2 = false;
  /* component normalizer */

  function __vue_normalize__$2(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "InlineActivator.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var InlineActivator = __vue_normalize__$2({
    render: __vue_render__$2,
    staticRenderFns: __vue_staticRenderFns__$2
  }, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2);

  //
  //
  //
  //
  //
  //
  //
  //
  var script$1 = {
    name: 'tailor-input-error',
    props: {
      error: {
        type: String,
        default: ''
      }
    }
  };

  var css_248z$1 = ".input-error[data-v-ff8d03d8]{color:var(--v-error-base);font-size:.75rem}";
  styleInject(css_248z$1);

  /* script */
  var __vue_script__$1 = script$1;
  /* template */

  var __vue_render__$1 = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('transition', {
      attrs: {
        "name": "message-transition"
      }
    }, [!!_vm.error ? _c('div', {
      staticClass: "input-error"
    }, [_vm._v("\n    " + _vm._s(_vm.error) + "\n  ")]) : _vm._e()]);
  };

  var __vue_staticRenderFns__$1 = [];
  /* style */

  var __vue_inject_styles__$1 = undefined;
  /* scoped */

  var __vue_scope_id__$1 = "data-v-ff8d03d8";
  /* functional template */

  var __vue_is_functional_template__$1 = false;
  /* component normalizer */

  function __vue_normalize__$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "InputError.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var InputError = __vue_normalize__$1({
    render: __vue_render__$1,
    staticRenderFns: __vue_staticRenderFns__$1
  }, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1);

  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  //
  var script = {
    name: 'tailor-preview-overlay',
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  };

  var css_248z = ".message[data-v-20303d2e]{border-radius:2px;font-size:1.125rem}";
  styleInject(css_248z);

  /* script */
  var __vue_script__ = script;
  /* template */

  var __vue_render__ = function __vue_render__() {
    var _vm = this;

    var _h = _vm.$createElement;

    var _c = _vm._self._c || _h;

    return _c('v-overlay', {
      attrs: {
        "value": _vm.show,
        "opacity": "0.9",
        "absolute": ""
      }
    }, [_c('button', {
      staticClass: "message pa-2 grey--text text--lighten-2"
    }, [_vm._t("default", [_vm._v("Click to preview")])], 2)]);
  };

  var __vue_staticRenderFns__ = [];
  /* style */

  var __vue_inject_styles__ = undefined;
  /* scoped */

  var __vue_scope_id__ = "data-v-20303d2e";
  /* functional template */

  var __vue_is_functional_template__ = false;
  /* component normalizer */

  function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
    var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

    component.__file = "PreviewOverlay.vue";

    if (!component.render) {
      component.render = template.render;
      component.staticRenderFns = template.staticRenderFns;
      component._compiled = true;
      if (functional) component.functional = true;
    }

    component._scopeId = scope;

    return component;
  }
  /* style inject */

  /* style inject SSR */


  var PreviewOverlay = __vue_normalize__({
    render: __vue_render__,
    staticRenderFns: __vue_staticRenderFns__
  }, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__);

  exports.ActiveUsers = ActiveUsers$1;
  exports.AddElement = AddElement;
  exports.ContainedContent = ContainedContent;
  exports.ContentElement = ContentElement;
  exports.Discussion = Discussion$1;
  exports.ElementList = ElementList;
  exports.ElementPlaceholder = ElementPlaceholder;
  exports.EmbeddedContainer = EmbeddedContainer;
  exports.InlineActivator = InlineActivator;
  exports.InputError = InputError;
  exports.PreviewOverlay = PreviewOverlay;
  exports.PublishDiffChip = PublishDiffChip;
  exports.SelectElement = SelectElement;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
