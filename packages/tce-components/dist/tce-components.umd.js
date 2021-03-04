(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('lodash/capitalize'), require('@extensionengine/tce-utils'), require('lodash/filter'), require('lodash/flatMap'), require('lodash/intersection'), require('lodash/pick'), require('lodash/reduce'), require('lodash/reject'), require('lodash/partition'), require('lodash/takeRight'), require('lodash/find'), require('pluralize'), require('@extensionengine/vue-radio'), require('lodash/orderBy'), require('lodash/get'), require('lodash/throttle'), require('vuedraggable'), require('lodash/cloneDeep'), require('lodash/mapKeys'), require('lodash/values')) :
  typeof define === 'function' && define.amd ? define(['exports', 'lodash/capitalize', '@extensionengine/tce-utils', 'lodash/filter', 'lodash/flatMap', 'lodash/intersection', 'lodash/pick', 'lodash/reduce', 'lodash/reject', 'lodash/partition', 'lodash/takeRight', 'lodash/find', 'pluralize', '@extensionengine/vue-radio', 'lodash/orderBy', 'lodash/get', 'lodash/throttle', 'vuedraggable', 'lodash/cloneDeep', 'lodash/mapKeys', 'lodash/values'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TceComponents = {}, global.capitalize, global.tceUtils, global.filter, global.flatMap, global.intersection, global.pick, global.reduce, global.reject, global.partition, global.takeRgt, global.find, global.pluralize, global.vueRadio, global.orderBy, global.get, global.throttle, global.Draggable, global.cloneDeep, global.mapKeys, global.values));
}(this, (function (exports, capitalize, tceUtils, filter, flatMap, intersection, pick, reduce, reject, partition, takeRgt, find, pluralize, vueRadio, orderBy, get, throttle, Draggable, cloneDeep, mapKeys, values) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var capitalize__default = /*#__PURE__*/_interopDefaultLegacy(capitalize);
  var filter__default = /*#__PURE__*/_interopDefaultLegacy(filter);
  var flatMap__default = /*#__PURE__*/_interopDefaultLegacy(flatMap);
  var intersection__default = /*#__PURE__*/_interopDefaultLegacy(intersection);
  var pick__default = /*#__PURE__*/_interopDefaultLegacy(pick);
  var reduce__default = /*#__PURE__*/_interopDefaultLegacy(reduce);
  var reject__default = /*#__PURE__*/_interopDefaultLegacy(reject);
  var partition__default = /*#__PURE__*/_interopDefaultLegacy(partition);
  var takeRgt__default = /*#__PURE__*/_interopDefaultLegacy(takeRgt);
  var find__default = /*#__PURE__*/_interopDefaultLegacy(find);
  var pluralize__default = /*#__PURE__*/_interopDefaultLegacy(pluralize);
  var orderBy__default = /*#__PURE__*/_interopDefaultLegacy(orderBy);
  var get__default = /*#__PURE__*/_interopDefaultLegacy(get);
  var throttle__default = /*#__PURE__*/_interopDefaultLegacy(throttle);
  var Draggable__default = /*#__PURE__*/_interopDefaultLegacy(Draggable);
  var cloneDeep__default = /*#__PURE__*/_interopDefaultLegacy(cloneDeep);
  var mapKeys__default = /*#__PURE__*/_interopDefaultLegacy(mapKeys);
  var values__default = /*#__PURE__*/_interopDefaultLegacy(values);

  //
  var script$l = {
    name: 'active-users',
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

  var css_248z$f = ".avatar[data-v-15a1beec]{transition:all .2s}.avatar img[data-v-15a1beec]{padding:.125rem}.avatar[data-v-15a1beec]:focus-within,.avatar[data-v-15a1beec]:hover{transform:scale(1.1);z-index:1}.avatar:focus-within img[data-v-15a1beec]:focus,.avatar:hover img[data-v-15a1beec]:focus{outline:0}";
  styleInject(css_248z$f);

  /* script */
  var __vue_script__$l = script$l;
  /* template */

  var __vue_render__$l = function __vue_render__() {
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

  var __vue_staticRenderFns__$l = [];
  /* style */

  var __vue_inject_styles__$l = undefined;
  /* scoped */

  var __vue_scope_id__$l = "data-v-15a1beec";
  /* functional template */

  var __vue_is_functional_template__$l = false;
  /* component normalizer */

  function __vue_normalize__$l(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


  var ActiveUsers = __vue_normalize__$l({
    render: __vue_render__$l,
    staticRenderFns: __vue_staticRenderFns__$l
  }, __vue_inject_styles__$l, __vue_script__$l, __vue_scope_id__$l, __vue_is_functional_template__$l);

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
  var script$k = {
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

  var css_248z$e = ".element-container[data-v-5e4d908e]{min-height:20rem;padding:0 0 1.875rem;border-top-left-radius:.5rem;border-top-right-radius:.5rem;overflow:hidden}.group-heading[data-v-5e4d908e]{margin:0 2.5rem .375rem;padding-top:.5rem;font-size:.875rem;font-weight:500;line-height:1rem;text-align:left}.group-elements[data-v-5e4d908e]{display:flex;flex-wrap:wrap;width:100%;padding:0 1.875rem}.add-element[data-v-5e4d908e]{width:8.125rem;min-width:8.125rem;height:auto!important;min-height:4.375rem;padding:0!important;white-space:normal}.add-element[data-v-5e4d908e]  .v-btn__content{flex:1 1 100%;flex-direction:column;padding:.375rem;text-transform:none}.add-element .v-icon[data-v-5e4d908e]{padding:.125rem 0;font-size:1.875rem}.add-element .button-text[data-v-5e4d908e]{margin:.625rem 0}";
  styleInject(css_248z$e);

  /* script */
  var __vue_script__$k = script$k;
  /* template */

  var __vue_render__$k = function __vue_render__() {
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

  var __vue_staticRenderFns__$k = [];
  /* style */

  var __vue_inject_styles__$k = undefined;
  /* scoped */

  var __vue_scope_id__$k = "data-v-5e4d908e";
  /* functional template */

  var __vue_is_functional_template__$k = false;
  /* component normalizer */

  function __vue_normalize__$k(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


  var AddNewElement = __vue_normalize__$k({
    render: __vue_render__$k,
    staticRenderFns: __vue_staticRenderFns__$k
  }, __vue_inject_styles__$k, __vue_script__$k, __vue_scope_id__$k, __vue_is_functional_template__$k);

  //

  var SelectElement = function SelectElement() {
    return import('components/common/SelectElement');
  };

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
      id: tceUtils.uuid(),
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
    name: 'add-element',
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
          return !tceUtils.isQuestion(it.type);
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

        var positions = tceUtils.getPositions(this.items, this.position, elements.length);
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
          id: tceUtils.uuid(),
          embedded: true
        }; // If embed, assign id

        Object.assign(element, contextData);
        if (tceUtils.isQuestion(element.type)) element.data = getQuestionData(element, subtype);
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
      AddNewElement: AddNewElement,
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
    name: 'editor-link',
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
    name: 'embedded-discussion',
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

  var css_248z$7 = ".embedded-discussion[data-v-a96888f8]{font-family:Roboto,Arial,sans-serif}.embedded-discussion .resolve-btn-container[data-v-a96888f8]{display:flex;justify-content:flex-end;margin:.5rem 0 0 0}.embedded-discussion .header[data-v-a96888f8]{margin:.875rem 0 1.625rem 0;font-size:1.125rem;font-weight:400}.embedded-discussion .comment-input[data-v-a96888f8]{margin:0 .25rem 0 .25rem}.embedded-discussion .alert[data-v-a96888f8]  .v-icon{color:var(--v-primary-darken2)!important}";
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

  var __vue_scope_id__$a = "data-v-a96888f8";
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
    name: 'element-discussion',
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
        return tceUtils.Events.Discussion;
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
        return this.editorBus.emit(tceUtils.Events.Discussion.SAVE, Object.assign({}, data, {
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

  var css_248z$6 = "[data-v-32a30371] .v-menu__content{background:#fff}[data-v-32a30371] .v-menu__content .embedded-discussion{text-align:left}[data-v-32a30371] .v-menu__content .comment .author{font-size:.875rem}.unseen[data-v-32a30371]{font-size:.75rem}";
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

  var __vue_scope_id__$9 = "data-v-32a30371";
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
    name: 'publish-diff-chip',
    props: {
      changeType: {
        validator: function validator(value) {
          if (!value) return true;
          return Object.values(tceUtils.publishDiffChangeTypes).includes(value);
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
    name: 'content-element',
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
        return tceUtils.getElementId(vm.element);
      },
      componentName: function componentName(vm) {
        return tceUtils.getComponentName(vm.element.type);
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
        _this.isFocused = !!element && tceUtils.getElementId(element) === _this.id;
      });
    },
    provide: function provide() {
      return {
        $elementBus: this.elementBus
      };
    },
    components: {
      ActiveUsers: ActiveUsers,
      Discussion: Discussion,
      PublishDiffChip: PublishDiffChip
    }
  };

  var css_248z$5 = ".content-element[data-v-3d2ab02a]{position:relative;border:1px solid transparent}.content-element[data-v-3d2ab02a]::after{content:'';display:none;position:absolute;top:0;right:-.125rem;width:.125rem;height:100%}.content-element.focused[data-v-3d2ab02a]{border:1px dashed #1de9b6}.content-element.focused[data-v-3d2ab02a]::after{display:block;background:#1de9b6}.content-element.selected[data-v-3d2ab02a]{border:1px dashed #ff4081}.content-element.selected[data-v-3d2ab02a]::after{display:block;background:#ff4081}.frame[data-v-3d2ab02a]{padding:10px 20px;border:1px solid #e1e1e1}.element-actions[data-v-3d2ab02a]{display:flex;flex-direction:column;position:absolute;top:-.0625rem;right:-1.25rem;width:1.5rem;height:100%;padding-left:.75rem}.element-actions>*[data-v-3d2ab02a]{min-height:1.75rem;opacity:0;transition:opacity .1s linear}.element-actions>.is-visible[data-v-3d2ab02a]{opacity:1;transition:opacity .5s linear}.active-users[data-v-3d2ab02a]{position:absolute;top:0;left:-1.625rem}.save-indicator[data-v-3d2ab02a]{position:absolute;bottom:-.125rem;left:0}.header[data-v-3d2ab02a]{width:100%;max-height:0}.header.visible[data-v-3d2ab02a]{max-height:unset;padding:0 0 .5rem}.diff.new[data-v-3d2ab02a]{border:none;box-shadow:0 0 0 2px var(--v-success-lighten2)!important}.diff.changed[data-v-3d2ab02a],.diff.removed[data-v-3d2ab02a]{border:none;box-shadow:0 0 0 2px var(--v-secondary-lighten4)!important}.diff .element-actions[data-v-3d2ab02a]{display:none}";
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

  var __vue_scope_id__$7 = "data-v-3d2ab02a";
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
    name: 'contained-content',
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

  var css_248z$4 = ".drag-handle[data-v-eb67dfae]{position:absolute;left:-3px;z-index:2;width:26px;opacity:0}.drag-handle .mdi[data-v-eb67dfae]{color:#888;font-size:28px}.hovered .drag-handle[data-v-eb67dfae]{opacity:1;transition:opacity .6s ease-in-out;cursor:pointer}.disabled .drag-handle[data-v-eb67dfae]{display:none}.contained-content[data-v-eb67dfae]{position:relative;margin:7px 0;padding:0}";
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

  var __vue_scope_id__$6 = "data-v-eb67dfae";
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
    name: 'element-list',
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
      getElementId: tceUtils.getElementId,
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

  var css_248z$3 = ".list-group[data-v-5e5c4768]{padding:.625rem 1.5rem}[data-v-5e5c4768] .sortable-ghost .drag-handle{display:none}[data-v-5e5c4768] .sortable-ghost .content-element{max-height:9.375rem;background:#f4f5f5}[data-v-5e5c4768] .sortable-ghost .content-element>*{visibility:hidden}[data-v-5e5c4768] .sortable-drag .content-element{max-height:auto;background:#fff}";
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

  var __vue_scope_id__$5 = "data-v-5e5c4768";
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
    name: 'element-placeholder',
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
    name: 'embedded-container',
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
        reordered.position = tceUtils.calculatePosition(context);
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
    name: 'inline-activator',
    inheritAttrs: false,
    props: {
      disabled: {
        type: Boolean,
        required: false
      }
    }
  };

  var css_248z$2 = ".default-activator-state[data-v-d03c1dc8],.inline-activator[data-v-d03c1dc8],.inline-activator.disabled[data-v-d03c1dc8],.inline-activator.disabled[data-v-d03c1dc8]:hover{padding:0 3.125rem;opacity:0}.inline-activator[data-v-d03c1dc8]{display:flex;align-items:center;width:100%;margin:0;padding:0 3.125rem;opacity:0;transition:opacity .3s,padding .3s}.inline-activator[data-v-d03c1dc8],.inline-activator .v-chip[data-v-d03c1dc8]{cursor:pointer}.inline-activator hr[data-v-d03c1dc8]{flex:1;display:inline-flex;margin:0;border-top:.0625rem dashed var(--v-primary-darken3)}.inline-activator[data-v-d03c1dc8]:focus,.inline-activator[data-v-d03c1dc8]:hover{padding:.75rem 0;opacity:1;outline:0;transition:opacity .3s .25s,padding .3s .1s}.inline-activator.disabled[data-v-d03c1dc8],.inline-activator.disabled[data-v-d03c1dc8]:hover{pointer-events:none}";
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
    }, _vm.listeners), [_c('hr'), _vm._v(" "), _c('v-avatar', {
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

  var __vue_scope_id__$2 = "data-v-d03c1dc8";
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
    props: {
      error: {
        type: String,
        default: ''
      }
    }
  };

  var css_248z$1 = ".input-error[data-v-33d55bb8]{color:var(--v-error-base);font-size:.75rem}";
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

  var __vue_scope_id__$1 = "data-v-33d55bb8";
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
    name: 'tce-preview-overlay',
    props: {
      show: {
        type: Boolean,
        default: false
      }
    }
  };

  var css_248z = ".message[data-v-4e41c6e0]{border-radius:2px;font-size:1.125rem}";
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

  var __vue_scope_id__ = "data-v-4e41c6e0";
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

  exports.ActiveUsers = ActiveUsers;
  exports.AddElement = AddElement;
  exports.ContainedContent = ContainedContent;
  exports.Discussion = Discussion$1;
  exports.ElementList = ElementList;
  exports.ElementPlaceholder = ElementPlaceholder;
  exports.EmbeddedContainer = EmbeddedContainer;
  exports.InlineActivator = InlineActivator;
  exports.InputError = InputError;
  exports.PreviewOverlay = PreviewOverlay;
  exports.PublishDiffChip = PublishDiffChip;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
