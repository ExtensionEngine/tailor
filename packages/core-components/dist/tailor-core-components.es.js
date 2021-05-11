import capitalize from 'lodash/capitalize';
import { Events, publishDiffChangeTypes, getElementId, getComponentName, activity, isQuestion, getPositions, uuid, assessment, processAnswerType, calculatePosition } from '@tailor-cms/utils';
import filter from 'lodash/filter';
import flatMap from 'lodash/flatMap';
import intersection from 'lodash/intersection';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';
import reject from 'lodash/reject';
import partition from 'lodash/partition';
import takeRgt from 'lodash/takeRight';
import find from 'lodash/find';
import pluralize from 'pluralize';
import { mapRequests, mapChannels } from '@extensionengine/vue-radio';
import orderBy from 'lodash/orderBy';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import pMinDelay from 'p-min-delay';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import debounce from 'lodash/debounce';
import sortBy from 'lodash/sortBy';
import cloneDeep from 'lodash/cloneDeep';
import * as yup from 'yup';
import isArray from 'lodash/isArray';
import { quillEditor } from 'vue-quill-editor';
import some from 'lodash/some';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import throttle from 'lodash/throttle';
import Draggable from 'vuedraggable';
import findIndex from 'lodash/findIndex';
import head from 'lodash/head';
import pullAt from 'lodash/pullAt';
import set from 'lodash/set';
import last from 'lodash/last';
import uniqueId from 'lodash/uniqueId';
import mapKeys from 'lodash/mapKeys';
import values from 'lodash/values';
import { upload } from '@tailor-cms/core-components';

//
var script$A = {
  name: 'tailor-active-users',
  props: {
    users: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    size: {
      type: Number,
      "default": 36
    }
  },
  filters: {
    capitalize: capitalize
  }
};

/* script */
var __vue_script__$A = script$A;
/* template */

var __vue_render__$A = function __vue_render__() {
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

var __vue_staticRenderFns__$A = [];
/* style */

var __vue_inject_styles__$A = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-33d463d4_0", {
    source: ".avatar[data-v-33d463d4]{transition:all .2s}.avatar img[data-v-33d463d4]{padding:.125rem}.avatar[data-v-33d463d4]:focus-within,.avatar[data-v-33d463d4]:hover{transform:scale(1.1);z-index:1}.avatar:focus-within img[data-v-33d463d4]:focus,.avatar:hover img[data-v-33d463d4]:focus{outline:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$A = "data-v-33d463d4";
/* module identifier */

var __vue_module_identifier__$o = undefined;
/* functional template */

var __vue_is_functional_template__$A = false;
/* component normalizer */

function __vue_normalize__$A(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "ActiveUsers.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$o() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$o.styles || (__vue_create_injector__$o.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ActiveUsers = __vue_normalize__$A({
  render: __vue_render__$A,
  staticRenderFns: __vue_staticRenderFns__$A
}, __vue_inject_styles__$A, __vue_script__$A, __vue_scope_id__$A, __vue_is_functional_template__$A, __vue_module_identifier__$o, __vue_create_injector__$o);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$z = {
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

/* script */
var __vue_script__$z = script$z;
/* template */

var __vue_render__$z = function __vue_render__() {
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

var __vue_staticRenderFns__$z = [];
/* style */

var __vue_inject_styles__$z = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-5e4d908e_0", {
    source: ".element-container[data-v-5e4d908e]{min-height:20rem;padding:0 0 1.875rem;border-top-left-radius:.5rem;border-top-right-radius:.5rem;overflow:hidden}.group-heading[data-v-5e4d908e]{margin:0 2.5rem .375rem;padding-top:.5rem;font-size:.875rem;font-weight:500;line-height:1rem;text-align:left}.group-elements[data-v-5e4d908e]{display:flex;flex-wrap:wrap;width:100%;padding:0 1.875rem}.add-element[data-v-5e4d908e]{width:8.125rem;min-width:8.125rem;height:auto!important;min-height:4.375rem;padding:0!important;white-space:normal}.add-element[data-v-5e4d908e]  .v-btn__content{flex:1 1 100%;flex-direction:column;padding:.375rem;text-transform:none}.add-element .v-icon[data-v-5e4d908e]{padding:.125rem 0;font-size:1.875rem}.add-element .button-text[data-v-5e4d908e]{margin:.625rem 0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$z = "data-v-5e4d908e";
/* module identifier */

var __vue_module_identifier__$n = undefined;
/* functional template */

var __vue_is_functional_template__$z = false;
/* component normalizer */

function __vue_normalize__$z(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "AddNewElement.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$n() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$n.styles || (__vue_create_injector__$n.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var AddNewElement = __vue_normalize__$z({
  render: __vue_render__$z,
  staticRenderFns: __vue_staticRenderFns__$z
}, __vue_inject_styles__$z, __vue_script__$z, __vue_scope_id__$z, __vue_is_functional_template__$z, __vue_module_identifier__$n, __vue_create_injector__$n);

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

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
//
var script$y = {
  name: 'tailor-editor-link',
  props: {
    activityId: {
      type: Number,
      required: true
    },
    elementUid: {
      type: String,
      "default": null
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
var __vue_script__$y = script$y;
/* template */

var __vue_render__$y = function __vue_render__() {
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

var __vue_staticRenderFns__$y = [];
/* style */

var __vue_inject_styles__$y = undefined;
/* scoped */

var __vue_scope_id__$y = undefined;
/* functional template */

var __vue_is_functional_template__$y = false;
/* component normalizer */

function __vue_normalize__$y(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var EditorLink = __vue_normalize__$y({
  render: __vue_render__$y,
  staticRenderFns: __vue_staticRenderFns__$y
}, __vue_inject_styles__$y, __vue_script__$y, __vue_scope_id__$y, __vue_is_functional_template__$y);

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

var script$x = {
  name: 'comment-header',
  props: {
    comment: {
      type: Object,
      required: true
    },
    isActivityThread: {
      type: Boolean,
      "default": false
    },
    isResolved: {
      type: Boolean,
      "default": false
    },
    elementLabel: {
      type: String,
      "default": null
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

/* script */
var __vue_script__$x = script$x;
/* template */

var __vue_render__$x = function __vue_render__() {
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

var __vue_staticRenderFns__$x = [];
/* style */

var __vue_inject_styles__$x = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-a1e0c4e8_0", {
    source: ".header[data-v-a1e0c4e8]{display:flex;align-items:flex-start}.header .comment-avatar[data-v-a1e0c4e8]{margin:.375rem .375rem 0 0}.header .info-container[data-v-a1e0c4e8]{display:flex;flex-direction:column;flex:0 100%;max-width:calc(100% - 8rem);margin-left:.125rem}.header .info-container .author[data-v-a1e0c4e8]{display:inline-block;max-width:75%;color:#000;font-size:1rem}.header .info-container .edited[data-v-a1e0c4e8],.header .info-container .time[data-v-a1e0c4e8]{color:#888;font-size:.75rem}.header .info-container hr.v-divider--vertical[data-v-a1e0c4e8]{margin:.25rem .125rem .125rem .625rem}.header .info-container[data-v-a1e0c4e8]  .editor-link{display:inline-flex;align-self:flex-end}.header .actions[data-v-a1e0c4e8]{margin-left:auto}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$x = "data-v-a1e0c4e8";
/* module identifier */

var __vue_module_identifier__$m = undefined;
/* functional template */

var __vue_is_functional_template__$x = false;
/* component normalizer */

function __vue_normalize__$x(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Header.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$m() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$m.styles || (__vue_create_injector__$m.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var CommentHeader = __vue_normalize__$x({
  render: __vue_render__$x,
  staticRenderFns: __vue_staticRenderFns__$x
}, __vue_inject_styles__$x, __vue_script__$x, __vue_scope_id__$x, __vue_is_functional_template__$x, __vue_module_identifier__$m, __vue_create_injector__$m);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$w = {
  name: 'comment-preview',
  props: {
    content: {
      type: String,
      "default": ''
    },
    isResolved: {
      type: Boolean,
      "default": false
    }
  }
};

/* script */
var __vue_script__$w = script$w;
/* template */

var __vue_render__$w = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "content",
    "class": {
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

var __vue_staticRenderFns__$w = [];
/* style */

var __vue_inject_styles__$w = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3d625308_0", {
    source: ".content[data-v-3d625308]{margin-top:.375rem}.content pre[data-v-3d625308]{height:100%;margin:0;padding:0 .25rem .5rem 0;font:inherit;white-space:pre-wrap;word-break:break-all;word-wrap:break-word;overflow-wrap:break-word;background:inherit;border:none;overflow:hidden}.content.resolved[data-v-3d625308]{opacity:.7}.content.resolved .resolvement-options[data-v-3d625308]{display:flex;align-items:center;margin-bottom:.25rem;font-size:.75rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$w = "data-v-3d625308";
/* module identifier */

var __vue_module_identifier__$l = undefined;
/* functional template */

var __vue_is_functional_template__$w = false;
/* component normalizer */

function __vue_normalize__$w(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Preview.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$l() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$l.styles || (__vue_create_injector__$l.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var CommentPreview = __vue_normalize__$w({
  render: __vue_render__$w,
  staticRenderFns: __vue_staticRenderFns__$w
}, __vue_inject_styles__$w, __vue_script__$w, __vue_scope_id__$w, __vue_is_functional_template__$w, __vue_module_identifier__$l, __vue_create_injector__$l);

//
var script$v = {
  name: 'thread-comment',
  props: {
    comment: {
      type: Object,
      required: true
    },
    isActivityThread: {
      type: Boolean,
      "default": false
    },
    elementLabel: {
      type: String,
      "default": null
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

/* script */
var __vue_script__$v = script$v;
/* template */

var __vue_render__$v = function __vue_render__() {
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

var __vue_staticRenderFns__$v = [];
/* style */

var __vue_inject_styles__$v = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-3d04e7dc_0", {
    source: ".comment[data-v-3d04e7dc]{display:flex;flex-direction:column;font-family:Roboto,Arial,sans-serif}.comment-body[data-v-3d04e7dc]{flex:1;padding:0 .25rem 0 2.625rem}.comment-editor.v-textarea[data-v-3d04e7dc]{margin:.75rem 0 0 0}.comment-editor.v-textarea[data-v-3d04e7dc]  .v-input__slot{width:auto}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$v = "data-v-3d04e7dc";
/* module identifier */

var __vue_module_identifier__$k = undefined;
/* functional template */

var __vue_is_functional_template__$v = false;
/* component normalizer */

function __vue_normalize__$v(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "index.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$k() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$k.styles || (__vue_create_injector__$k.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ThreadComment = __vue_normalize__$v({
  render: __vue_render__$v,
  staticRenderFns: __vue_staticRenderFns__$v
}, __vue_inject_styles__$v, __vue_script__$v, __vue_scope_id__$v, __vue_is_functional_template__$v, __vue_module_identifier__$k, __vue_create_injector__$k);

//
var script$u = {
  name: 'thread-list',
  inject: ['$teRegistry'],
  props: {
    comments: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    isActivityThread: {
      type: Boolean,
      "default": false
    },
    elementLabel: {
      type: String,
      "default": null
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
      return (_find = find(this.$teRegistry._registry, {
        type: contentElement.type
      })) === null || _find === void 0 ? void 0 : _find.name;
    }
  },
  components: {
    ThreadComment: ThreadComment
  }
};

/* script */
var __vue_script__$u = script$u;
/* template */

var __vue_render__$u = function __vue_render__() {
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

var __vue_staticRenderFns__$u = [];
/* style */

var __vue_inject_styles__$u = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-b5620cec_0", {
    source: ".thread-list[data-v-b5620cec]{margin:0;padding:0;list-style:none}.thread-list .thread-list-item .v-divider[data-v-b5620cec]{margin:0 .25rem 1rem .25rem}.thread-list .thread-list-item:first-child .v-divider[data-v-b5620cec]{display:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$u = "data-v-b5620cec";
/* module identifier */

var __vue_module_identifier__$j = undefined;
/* functional template */

var __vue_is_functional_template__$u = false;
/* component normalizer */

function __vue_normalize__$u(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "List.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$j() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$j.styles || (__vue_create_injector__$j.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ThreadList = __vue_normalize__$u({
  render: __vue_render__$u,
  staticRenderFns: __vue_staticRenderFns__$u
}, __vue_inject_styles__$u, __vue_script__$u, __vue_scope_id__$u, __vue_is_functional_template__$u, __vue_module_identifier__$j, __vue_create_injector__$j);

//
var script$t = {
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
      return "".concat(count, " new ").concat(pluralize('message', count));
    }
  }
};

/* script */
var __vue_script__$t = script$t;
/* template */

var __vue_render__$t = function __vue_render__() {
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

var __vue_staticRenderFns__$t = [];
/* style */

var __vue_inject_styles__$t = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-221b9d72_0", {
    source: ".unseen-divider[data-v-221b9d72]{text-align:center}.unseen-divider .v-divider[data-v-221b9d72]{margin:1rem 0 .25rem}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip{margin:-1.5rem 0 .5rem 0;border-radius:1rem!important;background-color:#fafafa!important}.unseen-divider[data-v-221b9d72]  .v-chip.v-chip--outlined.v-chip .v-chip__content .v-chip__close{margin-top:.125rem;font-size:.75rem!important}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$t = "data-v-221b9d72";
/* module identifier */

var __vue_module_identifier__$i = undefined;
/* functional template */

var __vue_is_functional_template__$t = false;
/* component normalizer */

function __vue_normalize__$t(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "UnseenDivider.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$i() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$i.styles || (__vue_create_injector__$i.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var UnseenDivider = __vue_normalize__$t({
  render: __vue_render__$t,
  staticRenderFns: __vue_staticRenderFns__$t
}, __vue_inject_styles__$t, __vue_script__$t, __vue_scope_id__$t, __vue_is_functional_template__$t, __vue_module_identifier__$i, __vue_create_injector__$i);

var script$s = {
  name: 'discussion-thread',
  props: {
    items: {
      type: Array,
      required: true
    },
    showAll: {
      type: Boolean,
      "default": false
    },
    minDisplayed: {
      type: Number,
      "default": 5
    },
    isActivityThread: {
      type: Boolean,
      "default": false
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
      var comments = showAll ? items : takeRgt(items, minDisplayed);

      var _partition = partition(comments, 'unseen'),
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

/* script */
var __vue_script__$s = script$s;
/* template */

var __vue_render__$s = function __vue_render__() {
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
    "class": {
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

var __vue_staticRenderFns__$s = [];
/* style */

var __vue_inject_styles__$s = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-c6af8436_0", {
    source: ".discussion-thread[data-v-c6af8436]{width:100%}.discussion-thread.scroll-container[data-v-c6af8436]{max-height:31.25rem;overflow-y:scroll;overflow-x:hidden;padding-right:1.5rem;box-sizing:content-box}.discussion-thread .fade-enter-active[data-v-c6af8436],.discussion-thread .fade-leave-active[data-v-c6af8436]{transition:opacity .5s}.discussion-thread .fade-enter[data-v-c6af8436],.discussion-thread .fade-leave-to[data-v-c6af8436]{opacity:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$s = "data-v-c6af8436";
/* module identifier */

var __vue_module_identifier__$h = undefined;
/* functional template */

var __vue_is_functional_template__$s = false;
/* component normalizer */

function __vue_normalize__$s(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "index.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$h() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$h.styles || (__vue_create_injector__$h.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var DiscussionThread = __vue_normalize__$s({
  render: __vue_render__$s,
  staticRenderFns: __vue_staticRenderFns__$s
}, __vue_inject_styles__$s, __vue_script__$s, __vue_scope_id__$s, __vue_is_functional_template__$s, __vue_module_identifier__$h, __vue_create_injector__$h);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$r = {
  name: 'resolve-comments-btn'
};

/* script */
var __vue_script__$r = script$r;
/* template */

var __vue_render__$r = function __vue_render__() {
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

var __vue_staticRenderFns__$r = [];
/* style */

var __vue_inject_styles__$r = undefined;
/* scoped */

var __vue_scope_id__$r = undefined;
/* functional template */

var __vue_is_functional_template__$r = false;
/* component normalizer */

function __vue_normalize__$r(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var ResolveButton = __vue_normalize__$r({
  render: __vue_render__$r,
  staticRenderFns: __vue_staticRenderFns__$r
}, __vue_inject_styles__$r, __vue_script__$r, __vue_scope_id__$r, __vue_is_functional_template__$r);

//

var initCommentInput = function initCommentInput() {
  return {
    content: ''
  };
};

var maxLength = function maxLength(input) {
  if (!input) return true;
  return input.length <= 600 || 'Max 600 characters';
};

var script$q = {
  name: 'tailor-embedded-discussion',
  inheritAttrs: true,
  props: {
    comments: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    unseenComments: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    commentsShownLimit: {
      type: Number,
      "default": 5
    },
    scrollTarget: {
      type: String,
      "default": 'discussion'
    },
    showHeading: {
      type: Boolean,
      "default": false
    },
    showNotifications: {
      type: Boolean,
      "default": false
    },
    isActivityThread: {
      type: Boolean,
      "default": false
    },
    hasUnresolvedComments: {
      type: Boolean,
      "default": false
    },
    isVisible: {
      type: Boolean,
      "default": false
    },
    user: {
      type: Object,
      required: true
    }
  },
  data: function data() {
    return {
      showAll: false,
      comment: initCommentInput(),
      error: false
    };
  },
  computed: {
    rules: function rules() {
      return [maxLength];
    },
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
      return orderBy(processedThread, ['unseen', 'createdAt'], 'asc');
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
    showResolveButton: function showResolveButton(vm) {
      return vm.hasUnresolvedComments && !vm.isActivityThread;
    }
  },
  methods: Object.assign({}, mapRequests('app', ['showConfirmationModal']), {
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
        return _this.$refs[scrollTarget].scrollIntoView(scrollOptions);
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

        if (!val && this.isActivityThread) return; // Focus comment input manually with delay to avoid
        // element focus prioritization (e.g HTML element)

        setTimeout(function () {
          return _this5.$refs.commentInput.focus();
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

/* script */
var __vue_script__$q = script$q;
/* template */

var __vue_render__$q = function __vue_render__() {
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
    "class": {
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
    ref: "inputContainer",
    staticClass: "text-right"
  }, [_c('v-textarea', {
    ref: "commentInput",
    staticClass: "comment-input",
    attrs: {
      "placeholder": _vm.commentsCount ? 'Add a comment...' : 'Start the discussion...',
      "rules": _vm.rules,
      "rows": "3",
      "outlined": "",
      "auto-grow": "",
      "clearable": "",
      "counter": ""
    },
    on: {
      "focus": function focus($event) {
        return _vm.$emit('seen');
      },
      "update:error": function updateError($event) {
        _vm.error = $event;
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
      "disabled": _vm.isTextEditorEmpty || _vm.error,
      "icon": ""
    },
    on: {
      "click": _vm.post
    }
  }, [_c('v-icon', [_vm._v("mdi-send")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$q = [];
/* style */

var __vue_inject_styles__$q = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-7b6d2083_0", {
    source: ".embedded-discussion[data-v-7b6d2083]{font-family:Roboto,Arial,sans-serif}.embedded-discussion .resolve-btn-container[data-v-7b6d2083]{display:flex;justify-content:flex-end;margin:.5rem 0 0 0}.embedded-discussion .header[data-v-7b6d2083]{margin:.875rem 0 1.625rem 0;font-size:1.125rem;font-weight:400}.embedded-discussion .comment-input[data-v-7b6d2083]{margin:0 .25rem 0 .25rem}.embedded-discussion .alert[data-v-7b6d2083]  .v-icon{color:var(--v-primary-darken2)!important}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$q = "data-v-7b6d2083";
/* module identifier */

var __vue_module_identifier__$g = undefined;
/* functional template */

var __vue_is_functional_template__$q = false;
/* component normalizer */

function __vue_normalize__$q(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "index.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$g() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$g.styles || (__vue_create_injector__$g.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var Discussion$1 = __vue_normalize__$q({
  render: __vue_render__$q,
  staticRenderFns: __vue_staticRenderFns__$q
}, __vue_inject_styles__$q, __vue_script__$q, __vue_scope_id__$q, __vue_is_functional_template__$q, __vue_module_identifier__$g, __vue_create_injector__$g);

//

var getActivatorOptions = function getActivatorOptions(unseenComments) {
  return {
    unseen: {
      "class": 'teal accent-4 white--text',
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

var script$p = {
  name: 'tailor-element-discussion',
  props: {
    id: {
      type: Number,
      "default": null
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
      "default": false
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
  computed: Object.assign({}, mapChannels({
    editorBus: 'editor'
  }), {
    events: function events() {
      return Events.Discussion;
    },
    lastCommentAt: function lastCommentAt(vm) {
      return new Date(get(vm.comments[0], 'createdAt', 0)).getTime();
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
      return this.editorBus.emit(Events.Discussion.SAVE, Object.assign({}, data, {
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
      if (val) this.$emit('open');
    }
  },
  components: {
    Discussion: Discussion$1
  }
};

/* script */
var __vue_script__$p = script$p;
/* template */

var __vue_render__$p = function __vue_render__() {
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
                "class": _vm.activator["class"],
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

var __vue_staticRenderFns__$p = [];
/* style */

var __vue_inject_styles__$p = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-98d34836_0", {
    source: "[data-v-98d34836] .v-menu__content{background:#fff}[data-v-98d34836] .v-menu__content .embedded-discussion{text-align:left}[data-v-98d34836] .v-menu__content .comment .author{font-size:.875rem}.unseen[data-v-98d34836]{font-size:.75rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$p = "data-v-98d34836";
/* module identifier */

var __vue_module_identifier__$f = undefined;
/* functional template */

var __vue_is_functional_template__$p = false;
/* component normalizer */

function __vue_normalize__$p(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "ElementDiscussion.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$f() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$f.styles || (__vue_create_injector__$f.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var Discussion = __vue_normalize__$p({
  render: __vue_render__$p,
  staticRenderFns: __vue_staticRenderFns__$p
}, __vue_inject_styles__$p, __vue_script__$p, __vue_scope_id__$p, __vue_is_functional_template__$p, __vue_module_identifier__$f, __vue_create_injector__$f);

//
var script$o = {
  name: 'tailor-publish-diff-chip',
  props: {
    changeType: {
      validator: function validator(value) {
        if (!value) return true;
        return Object.values(publishDiffChangeTypes).includes(value);
      },
      "default": null
    }
  }
};

/* script */
var __vue_script__$o = script$o;
/* template */

var __vue_render__$o = function __vue_render__() {
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

var __vue_staticRenderFns__$o = [];
/* style */

var __vue_inject_styles__$o = undefined;
/* scoped */

var __vue_scope_id__$o = undefined;
/* functional template */

var __vue_is_functional_template__$o = false;
/* component normalizer */

function __vue_normalize__$o(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var PublishDiffChip = __vue_normalize__$o({
  render: __vue_render__$o,
  staticRenderFns: __vue_staticRenderFns__$o
}, __vue_inject_styles__$o, __vue_script__$o, __vue_scope_id__$o, __vue_is_functional_template__$o);

//
var script$n = {
  name: 'tailor-content-element',
  inject: {
    $getCurrentUser: {},
    $editorState: {
      "default": {}
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
      "default": null
    },
    isHovered: {
      type: Boolean,
      "default": false
    },
    isDragged: {
      type: Boolean,
      "default": false
    },
    isDisabled: {
      type: Boolean,
      "default": false
    },
    frame: {
      type: Boolean,
      "default": true
    },
    dense: {
      type: Boolean,
      "default": false
    },
    showDiscussion: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      isFocused: false,
      isSaving: false,
      activeUsers: []
    };
  },
  computed: Object.assign({}, mapChannels({
    editorBus: 'editor'
  }), {
    id: function id(vm) {
      return getElementId(vm.element);
    },
    componentName: function componentName(vm) {
      return getComponentName(vm.element.type);
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
      _this.isFocused = !!element && getElementId(element) === _this.id;
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

/* script */
var __vue_script__$n = script$n;
/* template */

var __vue_render__$n = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "content-element",
    "class": [_vm.element.changeSincePublish, {
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
    "class": {
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
    "class": {
      'is-visible': _vm.isHighlighted || _vm.hasComments
    }
  }, [_c('discussion', _vm._b({
    attrs: {
      "user": _vm.currentUser
    },
    on: {
      "open": _vm.focus
    }
  }, 'discussion', _vm.element, false))], 1) : _vm._e(), _vm._v(" "), !_vm.parent ? _c('div', {
    "class": {
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

var __vue_staticRenderFns__$n = [];
/* style */

var __vue_inject_styles__$n = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-13d7855e_0", {
    source: ".content-element[data-v-13d7855e]{position:relative;border:1px solid transparent}.content-element[data-v-13d7855e]::after{content:'';display:none;position:absolute;top:0;right:-.125rem;width:.125rem;height:100%}.content-element.focused[data-v-13d7855e]{border:1px dashed #1de9b6}.content-element.focused[data-v-13d7855e]::after{display:block;background:#1de9b6}.content-element.selected[data-v-13d7855e]{border:1px dashed #ff4081}.content-element.selected[data-v-13d7855e]::after{display:block;background:#ff4081}.frame[data-v-13d7855e]{padding:10px 20px;border:1px solid #e1e1e1}.element-actions[data-v-13d7855e]{display:flex;flex-direction:column;position:absolute;top:-.0625rem;right:-1.25rem;width:1.5rem;height:100%;padding-left:.75rem}.element-actions>*[data-v-13d7855e]{min-height:1.75rem;opacity:0;transition:opacity .1s linear}.element-actions>.is-visible[data-v-13d7855e]{opacity:1;transition:opacity .5s linear}.active-users[data-v-13d7855e]{position:absolute;top:0;left:-1.625rem}.save-indicator[data-v-13d7855e]{position:absolute;bottom:-.125rem;left:0}.header[data-v-13d7855e]{width:100%;max-height:0}.header.visible[data-v-13d7855e]{max-height:unset;padding:0 0 .5rem}.diff.new[data-v-13d7855e]{border:none;box-shadow:0 0 0 2px var(--v-success-lighten2)!important}.diff.changed[data-v-13d7855e],.diff.removed[data-v-13d7855e]{border:none;box-shadow:0 0 0 2px var(--v-secondary-lighten4)!important}.diff .element-actions[data-v-13d7855e]{display:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$n = "data-v-13d7855e";
/* module identifier */

var __vue_module_identifier__$e = undefined;
/* functional template */

var __vue_is_functional_template__$n = false;
/* component normalizer */

function __vue_normalize__$n(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "ContentElement.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$e() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$e.styles || (__vue_create_injector__$e.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ContentElement$1 = __vue_normalize__$n({
  render: __vue_render__$n,
  staticRenderFns: __vue_staticRenderFns__$n
}, __vue_inject_styles__$n, __vue_script__$n, __vue_scope_id__$n, __vue_is_functional_template__$n, __vue_module_identifier__$e, __vue_create_injector__$e);

//
var script$m = {
  name: 'content-element-preview',
  props: {
    element: {
      type: Object,
      required: true
    },
    selectable: {
      type: Boolean,
      "default": false
    },
    isSelected: {
      type: Boolean,
      "default": false
    },
    selectionDisabled: {
      type: Boolean,
      "default": false
    }
  },
  computed: {
    disabled: function disabled(vm) {
      return vm.selectionDisabled && !vm.isSelected;
    },
    elementWidth: function elementWidth(vm) {
      return "col-xs-".concat(get(vm.element, 'data.width', 12));
    }
  },
  methods: {
    toggleSelection: function toggleSelection() {
      if (!this.selectable || this.disabled) return;
      this.$emit('toggle');
    }
  },
  components: {
    ContentElement: ContentElement$1
  }
};

/* script */
var __vue_script__$m = script$m;
/* template */

var __vue_render__$m = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "element-preview-container float-none",
    "class": _vm.elementWidth
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
          "class": {
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
                "class": {
                  visible: hover
                },
                attrs: {
                  "color": "blue-grey darken-4",
                  "fab": "",
                  "depressed": "",
                  "x-small": "",
                  "dark": ""
                },
                on: {
                  "click": function click($event) {
                    $event.stopPropagation();
                    return _vm.$emit('element:open', _vm.element.uid);
                  }
                }
              }, on), [_c('v-icon', {
                attrs: {
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

var __vue_staticRenderFns__$m = [];
/* style */

var __vue_inject_styles__$m = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-0ab49a1f_0", {
    source: ".element-preview-container[data-v-0ab49a1f]{display:flex;position:relative;margin:.25rem 0}.element-preview-container .v-input[data-v-0ab49a1f]{margin:0}.content-element[data-v-0ab49a1f]{flex:1 0;margin:.4375rem 0 0 .25rem;box-shadow:none;border:1px solid #e1e1e1}.content-element.selected[data-v-0ab49a1f]{border-style:dashed;border-color:#444}.content-element.selected[data-v-0ab49a1f]::after{display:none}.element-preview-container[data-v-0ab49a1f]  .contained-content{margin:0}.element-preview-container[data-v-0ab49a1f]  .contained-content .message span:not(.heading){display:none}.element-preview-container[data-v-0ab49a1f]  .contained-content .ql-editor{word-break:break-all}.element-wrapper[data-v-0ab49a1f]{position:relative}.open-element-button[data-v-0ab49a1f]{position:absolute;top:0;right:-.75rem;transition:opacity .4s}.open-element-button[data-v-0ab49a1f]:not(.visible){opacity:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$m = "data-v-0ab49a1f";
/* module identifier */

var __vue_module_identifier__$d = undefined;
/* functional template */

var __vue_is_functional_template__$m = false;
/* component normalizer */

function __vue_normalize__$m(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Element.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$d() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$d.styles || (__vue_create_injector__$d.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ContentElement = __vue_normalize__$m({
  render: __vue_render__$m,
  staticRenderFns: __vue_staticRenderFns__$m
}, __vue_inject_styles__$m, __vue_script__$m, __vue_scope_id__$m, __vue_is_functional_template__$m, __vue_module_identifier__$d, __vue_create_injector__$d);

//
var script$l = {
  name: 'content-preview',
  props: {
    contentContainers: {
      type: Array,
      required: true
    },
    selectable: {
      type: Boolean,
      "default": false
    },
    multiple: {
      type: Boolean,
      "default": true
    },
    allowedTypes: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    selected: {
      type: Array,
      "default": function _default() {
        return [];
      }
    }
  },
  computed: {
    isSelectionDisabled: function isSelectionDisabled() {
      return this.selectable && !this.multiple && !!this.selected.length;
    },
    selectionMap: function selectionMap(vm) {
      return keyBy(vm.selected, 'id');
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
    ContentElement: ContentElement
  }
};

/* script */
var __vue_script__$l = script$l;
/* template */

var __vue_render__$l = function __vue_render__() {
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

var __vue_staticRenderFns__$l = [];
/* style */

var __vue_inject_styles__$l = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-2013b96d_0", {
    source: ".content-preview .v-alert[data-v-2013b96d]{display:flex;align-items:center;justify-content:center;height:19rem}.content-preview .content-container[data-v-2013b96d]:last-child{margin-bottom:.625rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$l = "data-v-2013b96d";
/* module identifier */

var __vue_module_identifier__$c = undefined;
/* functional template */

var __vue_is_functional_template__$l = false;
/* component normalizer */

function __vue_normalize__$l(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "index.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$c() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$c.styles || (__vue_create_injector__$c.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ContentPreview = __vue_normalize__$l({
  render: __vue_render__$l,
  staticRenderFns: __vue_staticRenderFns__$l
}, __vue_inject_styles__$l, __vue_script__$l, __vue_scope_id__$l, __vue_is_functional_template__$l, __vue_module_identifier__$c, __vue_create_injector__$c);

function loader(action, name) {
  var minDuration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  return function () {
    var _this = this;

    this[name] = true;
    return pMinDelay(Promise.resolve(action.call.apply(action, [this].concat(Array.prototype.slice.call(arguments)))), minDuration)["finally"](function () {
      return _this[name] = false;
    });
  };
}

//
var toTreeFormat = activity.toTreeFormat;
var script$k = {
  name: 'select-activity',
  inject: ['$schemaService'],
  props: {
    selectedElements: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    activities: {
      type: Array,
      "default": function _default() {
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
      return groupBy(vm.selectedElements, 'outlineId');
    },
    expandedActivityIds: function expandedActivityIds(vm) {
      return map(vm.activities, 'id');
    },
    activityTree: function activityTree() {
      return toTreeFormat(this.activities, {
        filterNodesFn: this.$schemaService.filterOutlineActivities
      });
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
      return this.$schemaService.isEditable(type);
    },
    getChipLabel: function getChipLabel(_ref) {
      var length = _ref.length;
      return "".concat(length, " ").concat(pluralize('element', length), " selected");
    }
  }
};

/* script */
var __vue_script__$k = script$k;
/* template */

var __vue_render__$k = function __vue_render__() {
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

var __vue_staticRenderFns__$k = [];
/* style */

var __vue_inject_styles__$k = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-350cd4e3_0", {
    source: ".treeview[data-v-350cd4e3]{max-height:19rem;text-align:left;background-color:#fcfcfc;border:1px solid #eee;overflow-y:scroll}.treeview .v-chip.custom-chip[data-v-350cd4e3]{border-radius:12px!important}.treeview[data-v-350cd4e3]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__content>*,.treeview[data-v-350cd4e3]  .v-treeview-node--leaf>.treeview ::v-deep .v-treeview-node__root{cursor:auto}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$k = "data-v-350cd4e3";
/* module identifier */

var __vue_module_identifier__$b = undefined;
/* functional template */

var __vue_is_functional_template__$k = false;
/* component normalizer */

function __vue_normalize__$k(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "SelectActivity.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$b() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$b.styles || (__vue_create_injector__$b.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var SelectActivity = __vue_normalize__$k({
  render: __vue_render__$k,
  staticRenderFns: __vue_staticRenderFns__$k
}, __vue_inject_styles__$k, __vue_script__$k, __vue_scope_id__$k, __vue_is_functional_template__$k, __vue_module_identifier__$b, __vue_create_injector__$b);

//
var script$j = {
  name: 'select-repository',
  props: {
    repository: {
      type: Object,
      "default": null
    }
  },
  inject: ['$api'],
  data: function data() {
    return {
      repositories: [],
      loading: false
    };
  },
  methods: {
    selectRepository: function selectRepository(repository) {
      if (find(this.repositories, {
        id: repository.id
      })) {
        this.$emit('selected', repository);
      }
    },
    fetchRepositories: debounce(loader(function (search) {
      var _this = this;

      return this.$api.fetchRepositories({
        search: search
      }).then(function (repositories) {
        _this.repositories = sortBy(repositories, 'name');
      });
    }, 'loading'), 500)
  },
  created: function created() {
    this.fetchRepositories();
  }
};

/* script */
var __vue_script__$j = script$j;
/* template */

var __vue_render__$j = function __vue_render__() {
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


var SelectRepository = __vue_normalize__$j({
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
//
//
//
//
//
//
//
var script$i = {
  name: 'tailor-dialog',
  props: {
    headerIcon: {
      type: String,
      "default": null
    },
    width: {
      type: [Number, String],
      "default": 500
    },
    paddingless: {
      type: Boolean,
      "default": false
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
    "class": [_vm.paddingless ? 'pa-0' : 'pt-7 px-4 pb-2']
  }, [_vm._t("body")], 2), _vm._v(" "), _vm.$slots.actions ? _c('v-card-actions', {
    staticClass: "px-4 pb-3"
  }, [_c('v-spacer'), _vm._v(" "), _vm._t("actions")], 2) : _vm._e()], 1)], 1);
};

var __vue_staticRenderFns__$i = [];
/* style */

var __vue_inject_styles__$i = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-b6f646a2_0", {
    source: ".dialog-title[data-v-b6f646a2]{display:flex;color:#f1f1f1}.dialog-title .text-truncate[data-v-b6f646a2]{flex:1;text-align:left}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$i = "data-v-b6f646a2";
/* module identifier */

var __vue_module_identifier__$a = undefined;
/* functional template */

var __vue_is_functional_template__$i = false;
/* component normalizer */

function __vue_normalize__$i(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "TailorDialog.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$a() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$a.styles || (__vue_create_injector__$a.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var TailorDialog = __vue_normalize__$i({
  render: __vue_render__$i,
  staticRenderFns: __vue_staticRenderFns__$i
}, __vue_inject_styles__$i, __vue_script__$i, __vue_scope_id__$i, __vue_is_functional_template__$i, __vue_module_identifier__$a, __vue_create_injector__$a);

var getDescendants = activity.getDescendants;
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
var script$h = {
  name: 'select-element',
  inject: ['$schemaService', '$repository', '$api'],
  props: {
    selected: {
      type: Array,
      "default": function _default() {
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
      "default": true
    },
    submitLabel: {
      type: String,
      "default": 'Save'
    },
    headerIcon: {
      type: String,
      "default": 'mdi-toy-brick-plus-outline'
    },
    onlyCurrentRepo: {
      type: Boolean,
      "default": false
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
  computed: {
    currentRepository: function currentRepository(vm) {
      return vm.$repository;
    },
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
      var containers = sortBy(activities.filter(this.isRootContainer), [this.getTypePosition, 'position', 'createdAt']);
      return flatMap(containers, function (it) {
        return [it].concat(_toConsumableArray(_this.getSubcontainers(it)));
      });
    },
    elements: function elements() {
      var _this2 = this;

      var elements = flatMap(this.items.contentContainers, 'elements');
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
  },
  methods: {
    getContainerTypes: function getContainerTypes(type) {
      return map(this.$schemaService.getSupportedContainers(type), 'type');
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
      return sortBy(getDescendants(activities, container), 'position');
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
        elements: sortBy(containerElements, 'position')
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
      var currentRepository = this.currentRepository;
      this.selection.repository = repository;
      this.deselectActivity();
      this.items.activities = currentRepository.id === repository.id ? currentRepository.activities : await this.fetchActivities(repository);
    },
    fetchActivities: loader(function (repository) {
      return this.$api.fetchActivities(repository.id);
    }, 'loadingContent'),
    fetchElements: loader(function (containers) {
      var repositoryId = this.selection.repository.id;
      var queryOpts = {
        repositoryId: repositoryId,
        ids: containers.map(function (it) {
          return it.id;
        })
      };
      return this.$api.fetchContentElements(queryOpts);
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
    this.items.activities = this.currentRepository.activities;
  },
  components: {
    ContentPreview: ContentPreview,
    SelectActivity: SelectActivity,
    SelectRepository: SelectRepository,
    TailorDialog: TailorDialog
  }
};

/* script */
var __vue_script__$h = script$h;
/* template */

var __vue_render__$h = function __vue_render__() {
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

var __vue_staticRenderFns__$h = [];
/* style */

var __vue_inject_styles__$h = undefined;
/* scoped */

var __vue_scope_id__$h = undefined;
/* functional template */

var __vue_is_functional_template__$h = false;
/* component normalizer */

function __vue_normalize__$h(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var SelectElement = __vue_normalize__$h({
  render: __vue_render__$h,
  staticRenderFns: __vue_staticRenderFns__$h
}, __vue_inject_styles__$h, __vue_script__$h, __vue_scope_id__$h, __vue_is_functional_template__$h);

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
    id: uuid(),
    data: data,
    type: 'JODIT_HTML',
    embedded: true
  }];
  return Object.assign({
    question: question,
    type: type
  }, element.data);
};

var script$g = {
  name: 'tailor-add-element',
  inject: ['$teRegistry'],
  props: {
    items: {
      type: Array,
      required: true
    },
    activity: {
      type: Object,
      "default": null
    },
    position: {
      type: Number,
      "default": null
    },
    layout: {
      type: Boolean,
      "default": true
    },
    include: {
      type: Array,
      "default": null
    },
    show: {
      type: Boolean,
      "default": false
    },
    large: {
      type: Boolean,
      "default": false
    },
    label: {
      type: String,
      "default": 'Add content'
    },
    icon: {
      type: String,
      "default": 'mdi-plus'
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
      return filter(this.registry, {
        type: 'QUESTION'
      });
    },
    contentElements: function contentElements() {
      var _this = this;

      var items = filter(this.registry, function (it) {
        return !isQuestion(it.type);
      });
      if (!this.isSubset) return items;
      return filter(items, function (it) {
        return _this.include.includes(it.type);
      });
    },
    assessments: function assessments() {
      var registry = this.registry,
          isSubset = this.isSubset,
          include = this.include,
          questions = this.questions;
      if (isSubset && !include.includes('ASSESSMENT')) return [];
      return filter(registry, {
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
      return filter(registry, {
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
      return reduce(groups, function (acc, elements, i) {
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
      var elements = flatMap(library, 'elements');
      if (!layout) return include || [];
      var allowedElements = elementWidth === DEFAULT_ELEMENT_WIDTH ? elements : reject(elements, 'ui.forceFullWidth');
      var allowedTypes = allowedElements.map(function (it) {
        return it.type;
      });
      return include ? intersection(include, allowedTypes) : allowedTypes;
    }
  },
  methods: {
    addElements: function addElements(elements) {
      var _this2 = this;

      var positions = getPositions(this.items, this.position, elements.length);
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
      }, pick(el, ['type', 'refs']), {
        data: Object.assign({}, initState(), data, {
          width: width
        })
      });
      var contextData = activity ? {
        activityId: activity.id
      } // If content element within activity
      : {
        id: uuid(),
        embedded: true
      }; // If embed, assign id

      Object.assign(element, contextData);
      if (isQuestion(element.type)) element.data = getQuestionData(element, subtype);
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
var __vue_script__$g = script$g;
/* template */

var __vue_render__$g = function __vue_render__() {
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

var __vue_staticRenderFns__$g = [];
/* style */

var __vue_inject_styles__$g = undefined;
/* scoped */

var __vue_scope_id__$g = undefined;
/* functional template */

var __vue_is_functional_template__$g = false;
/* component normalizer */

function __vue_normalize__$g(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var AddElement = __vue_normalize__$g({
  render: __vue_render__$g,
  staticRenderFns: __vue_staticRenderFns__$g
}, __vue_inject_styles__$g, __vue_script__$g, __vue_scope_id__$g, __vue_is_functional_template__$g);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$f = {
  name: 'question-controls',
  props: {
    isEditing: {
      type: Boolean,
      "default": false
    }
  },
  methods: {
    save: function save() {
      var _this = this;

      // Make sure all other handlers are executed prior to save
      setTimeout(function () {
        return _this.$emit('save');
      }, 0);
    }
  }
};

/* script */
var __vue_script__$f = script$f;
/* template */

var __vue_render__$f = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "d-flex pb-4"
  }, [_c('v-spacer'), _vm._v(" "), _vm.isEditing ? _c('div', [_c('v-btn', {
    attrs: {
      "text": "",
      "large": ""
    },
    on: {
      "click": function click($event) {
        return _vm.$emit('cancel');
      }
    }
  }, [_vm._v("Cancel")]), _vm._v(" "), _c('v-btn', {
    attrs: {
      "color": "green darken-3",
      "text": "",
      "large": ""
    },
    on: {
      "click": _vm.save
    }
  }, [_c('v-icon', {
    staticClass: "pr-1"
  }, [_vm._v("mdi-check")]), _vm._v("\n      Save\n    ")], 1)], 1) : _c('v-btn', {
    attrs: {
      "color": "primary darken-4",
      "text": "",
      "large": ""
    },
    on: {
      "click": function click($event) {
        return _vm.$emit('edit');
      }
    }
  }, [_vm._v("\n    Edit\n  ")])], 1);
};

var __vue_staticRenderFns__$f = [];
/* style */

var __vue_inject_styles__$f = undefined;
/* scoped */

var __vue_scope_id__$f = undefined;
/* functional template */

var __vue_is_functional_template__$f = false;
/* component normalizer */

function __vue_normalize__$f(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Controls.vue";

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


var Controls = __vue_normalize__$f({
  render: __vue_render__$f,
  staticRenderFns: __vue_staticRenderFns__$f
}, __vue_inject_styles__$f, __vue_script__$f, __vue_scope_id__$f, __vue_is_functional_template__$f);

var QUILL_OPTIONS = {
  modules: {
    toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{
      list: 'ordered'
    }, {
      list: 'bullet'
    }], [{
      script: 'sub'
    }, {
      script: 'super'
    }], [{
      color: []
    }, {
      background: []
    }], ['link']]
  }
};

var getAnswerType = function getAnswerType(isGraded) {
  return isGraded ? 'Answer' : 'Option';
};

var getButtonLabel = function getButtonLabel(isExpanded) {
  return isExpanded ? 'hide' : 'show';
};

var script$e = {
  name: 'feedback',
  props: {
    answers: {
      type: [Array, Boolean],
      "default": null
    },
    feedback: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    isEditing: {
      type: Boolean,
      "default": false
    },
    isGraded: {
      type: Boolean,
      "default": false
    }
  },
  data: function data(vm) {
    return {
      isExpanded: some(vm.feedback)
    };
  },
  computed: {
    quillOptions: function quillOptions() {
      return QUILL_OPTIONS;
    },
    answerType: function answerType(vm) {
      return getAnswerType(vm.isGraded);
    },
    buttonLabel: function buttonLabel(vm) {
      return getButtonLabel(vm.isExpanded);
    },
    processedAnswers: function processedAnswers(vm) {
      return isArray(vm.answers) ? vm.answers : ['True', 'False'];
    }
  },
  methods: {
    updateFeedback: function updateFeedback(_ref, index) {
      var html = _ref.html;
      this.$emit('update', _defineProperty({}, index, html));
    },
    toggleExpand: function toggleExpand() {
      this.isExpanded = !this.isExpanded;
    }
  },
  watch: {
    isEditing: function isEditing(val) {
      if (!some(this.feedback)) return;
      if (val) this.isExpanded = true;
    }
  },
  components: {
    QuillEditor: quillEditor
  }
};

/* script */
var __vue_script__$e = script$e;
/* template */

var __vue_render__$e = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "px-1"
  }, [_c('div', [_c('span', {
    staticClass: "subtitle-2"
  }, [_vm._v("Feedback")]), _vm._v(" "), _c('v-btn', {
    staticClass: "ml-1",
    attrs: {
      "text": "",
      "small": ""
    },
    on: {
      "click": _vm.toggleExpand
    }
  }, [_vm._v("\n      " + _vm._s(_vm.buttonLabel) + "\n    ")])], 1), _vm._v(" "), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [_vm.isExpanded ? _c('div', {
    staticClass: "feedback-content"
  }, _vm._l(_vm.processedAnswers, function (answer, i) {
    return _c('v-row', {
      key: i
    }, [_c('v-col', [_c('div', {
      staticClass: "feedback-info mb-4"
    }, [_c('span', {
      staticClass: "answer-type subtitle-2"
    }, [_vm._v(_vm._s(_vm.answerType) + " " + _vm._s(i + 1) + ":")]), _vm._v(" "), _c('span', [_vm._v(_vm._s(answer || 'Answer not added.'))])]), _vm._v(" "), _vm.isEditing ? _c('quill-editor', {
      staticClass: "grey lighten-3",
      attrs: {
        "options": _vm.quillOptions,
        "content": _vm.feedback[i]
      },
      on: {
        "change": function change($event) {
          return _vm.updateFeedback($event, i);
        }
      }
    }) : _c('div', {
      staticClass: "feedback-preview"
    }, [_vm.feedback[i] ? _c('div', {
      domProps: {
        "innerHTML": _vm._s(_vm.feedback[i])
      }
    }) : _c('i', [_vm._v("Feedback not added.")])])], 1)], 1);
  }), 1) : _vm._e()])], 1);
};

var __vue_staticRenderFns__$e = [];
/* style */

var __vue_inject_styles__$e = undefined;
/* scoped */

var __vue_scope_id__$e = undefined;
/* functional template */

var __vue_is_functional_template__$e = false;
/* component normalizer */

function __vue_normalize__$e(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Feedback.vue";

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


var Feedback = __vue_normalize__$e({
  render: __vue_render__$e,
  staticRenderFns: __vue_staticRenderFns__$e
}, __vue_inject_styles__$e, __vue_script__$e, __vue_scope_id__$e, __vue_is_functional_template__$e);

//
var script$d = {
  name: 'tailor-contained-content',
  inheritAttrs: false,
  props: {
    element: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      "default": false
    },
    isDragged: {
      type: Boolean,
      "default": false
    },
    setWidth: {
      type: Boolean,
      "default": true
    },
    dense: {
      type: Boolean,
      "default": false
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
      return setWidth ? "col-xs-".concat(get(element, 'data.width', 12)) : '';
    }
  },
  methods: {
    scrollContainer: throttle(function (e) {
      var scrollUp = e.y < 200;
      var scrollDown = e.y > window.innerHeight - 200;
      if (scrollUp || scrollDown) window.scrollBy(0, scrollUp ? -30 : 30);
    }, 20)
  },
  components: {
    ContentElement: ContentElement$1
  }
};

/* script */
var __vue_script__$d = script$d;
/* template */

var __vue_render__$d = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "contained-content",
    "class": [_vm.widthClass, {
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

var __vue_staticRenderFns__$d = [];
/* style */

var __vue_inject_styles__$d = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-cb586726_0", {
    source: ".drag-handle[data-v-cb586726]{position:absolute;left:-3px;z-index:2;width:26px;opacity:0}.drag-handle .mdi[data-v-cb586726]{color:#888;font-size:28px}.hovered .drag-handle[data-v-cb586726]{opacity:1;transition:opacity .6s ease-in-out;cursor:pointer}.disabled .drag-handle[data-v-cb586726]{display:none}.contained-content[data-v-cb586726]{position:relative;margin:7px 0;padding:0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$d = "data-v-cb586726";
/* module identifier */

var __vue_module_identifier__$9 = undefined;
/* functional template */

var __vue_is_functional_template__$d = false;
/* component normalizer */

function __vue_normalize__$d(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "ContainedContent.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$9() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$9.styles || (__vue_create_injector__$9.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ContainedContent = __vue_normalize__$d({
  render: __vue_render__$d,
  staticRenderFns: __vue_staticRenderFns__$d
}, __vue_inject_styles__$d, __vue_script__$d, __vue_scope_id__$d, __vue_is_functional_template__$d, __vue_module_identifier__$9, __vue_create_injector__$9);

//
//
//
//
//
//
//
//
var script$c = {
  name: 'tailor-input-error',
  props: {
    error: {
      type: String,
      "default": ''
    }
  }
};

/* script */
var __vue_script__$c = script$c;
/* template */

var __vue_render__$c = function __vue_render__() {
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

var __vue_staticRenderFns__$c = [];
/* style */

var __vue_inject_styles__$c = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-ff8d03d8_0", {
    source: ".input-error[data-v-ff8d03d8]{color:var(--v-error-base);font-size:.75rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$c = "data-v-ff8d03d8";
/* module identifier */

var __vue_module_identifier__$8 = undefined;
/* functional template */

var __vue_is_functional_template__$c = false;
/* component normalizer */

function __vue_normalize__$c(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "InputError.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$8() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$8.styles || (__vue_create_injector__$8.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var InputError = __vue_normalize__$c({
  render: __vue_render__$c,
  staticRenderFns: __vue_staticRenderFns__$c
}, __vue_inject_styles__$c, __vue_script__$c, __vue_scope_id__$c, __vue_is_functional_template__$c, __vue_module_identifier__$8, __vue_create_injector__$8);

//
var DRAG_OPTIONS = {
  handle: '.drag-handle',
  scrollSensitivity: 125,
  scrollSpeed: 15
};
var script$b = {
  name: 'question',
  props: {
    assessment: {
      type: Object,
      required: true
    },
    errors: {
      type: Array,
      "default": function _default() {
        return [];
      }
    },
    isEditing: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      isFocused: false
    };
  },
  computed: Object.assign({}, mapChannels({
    editorChannel: 'editor'
  }), {
    question: {
      get: function get() {
        return cloneDeep(this.assessment.data.question);
      },
      set: function set(question) {
        this.$emit('update', {
          question: question
        });
      }
    },
    questionError: function questionError(vm) {
      return head(assessment.getErrorMessages(vm.errors, 'question'));
    },
    dragOptions: function dragOptions() {
      return DRAG_OPTIONS;
    }
  }),
  methods: {
    addQuestionElements: function addQuestionElements(elements) {
      var question = cloneDeep(this.assessment.data.question);
      this.$emit('update', {
        question: question.concat(elements)
      });
    },
    updateElement: function updateElement(element, data) {
      if (!this.isEditing) return;
      var question = cloneDeep(this.assessment.data.question);
      var index = findIndex(question, {
        id: element.id
      });
      if (index === -1) return;
      element = Object.assign({}, question[index], {
        data: data
      });
      this.$emit('update', {
        question: set(question, index, element)
      });
    },
    deleteElement: function deleteElement(element) {
      var question = cloneDeep(this.assessment.data.question);
      var index = findIndex(question, {
        id: element.id
      });
      if (index === -1) return;
      pullAt(question, index);
      this.$emit('update', {
        question: question
      });
    }
  },
  created: function created() {
    var _this = this;

    this.editorChannel.on('element:focus', function () {
      var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _this.isFocused = !!find(_this.question, {
        id: element.id
      });
    });
  },
  components: {
    AddElement: AddElement,
    ContainedContent: ContainedContent,
    Draggable: Draggable,
    InputError: InputError
  }
};

/* script */
var __vue_script__$b = script$b;
/* template */

var __vue_render__$b = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', [_c('div', {
    staticClass: "subtitle-2 mb-2"
  }, [_vm._v("Question")]), _vm._v(" "), _c('div', {
    "class": ['question-container', {
      focused: _vm.isFocused,
      disabled: !_vm.isEditing,
      incorrect: !!_vm.questionError
    }]
  }, [_c('draggable', _vm._b({
    staticClass: "row",
    model: {
      value: _vm.question,
      callback: function callback($$v) {
        _vm.question = $$v;
      },
      expression: "question"
    }
  }, 'draggable', _vm.dragOptions, false), _vm._l(_vm.question, function (element) {
    return _c('contained-content', {
      key: element.id,
      staticClass: "mb-4",
      attrs: {
        "element": element,
        "is-disabled": !_vm.isEditing,
        "dense": ""
      },
      on: {
        "save": function save($event) {
          return _vm.updateElement(element, $event);
        },
        "delete": function _delete($event) {
          return _vm.deleteElement(element);
        }
      }
    });
  }), 1)], 1), _vm._v(" "), _c('add-element', {
    "class": {
      invisible: !_vm.isEditing
    },
    attrs: {
      "items": _vm.question,
      "layout": false,
      "position": _vm.question.length,
      "disabled": !_vm.isEditing,
      "include": ['JODIT_HTML', 'IMAGE', 'EMBED', 'HTML']
    },
    on: {
      "add": _vm.addQuestionElements
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(ref) {
        var addElement = ref.addElement;
        return [_c('div', {
          staticClass: "d-flex justify-space-between mt-2 pl-3"
        }, [_c('input-error', {
          attrs: {
            "error": _vm.questionError
          }
        }), _vm._v(" "), _c('v-btn', {
          staticClass: "mt-2 ml-auto px-2",
          attrs: {
            "text": ""
          },
          on: {
            "click": addElement
          }
        }, [_c('v-icon', {
          staticClass: "mr-1",
          attrs: {
            "dense": ""
          }
        }, [_vm._v("mdi-plus")]), _vm._v("\n        Add question element\n      ")], 1)], 1)];
      }
    }])
  })], 1);
};

var __vue_staticRenderFns__$b = [];
/* style */

var __vue_inject_styles__$b = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-20130bd1_0", {
    source: ".question-container[data-v-20130bd1]{position:relative;min-height:8.75rem;padding:1rem 3rem 0 2.5rem;text-align:center;background:#ebebeb;border-radius:.125rem;transition:.3s cubic-bezier(.25,.8,.5,1)}.question-container[data-v-20130bd1]::after,.question-container[data-v-20130bd1]::before{content:'';position:absolute;bottom:-1px;left:0;width:100%;transition:.3s cubic-bezier(.25,.8,.5,1)}.question-container[data-v-20130bd1]::before{border-style:solid;border-width:thin 0 0 0}.question-container[data-v-20130bd1]::after{border-style:solid;border-width:thin 0 thin 0;transform:scaleX(0)}.question-container[data-v-20130bd1]:not(.focused):not(.disabled):not(.incorrect):hover{background:#dcdcdc}.question-container[data-v-20130bd1]:not(.focused):not(.disabled):not(.incorrect):hover  .content-element{border-color:#bbb}.focused[data-v-20130bd1]::after{transform:scaleX(1)}.disabled[data-v-20130bd1]{color:rgba(0,0,0,.38)}.disabled[data-v-20130bd1]::before{border-image:repeating-linear-gradient(to right,rgba(0,0,0,.38) 0,rgba(0,0,0,.38) .125rem,transparent .125rem,transparent .25rem) 1 repeat}.incorrect[data-v-20130bd1]::after,.incorrect[data-v-20130bd1]::before{border-color:var(--v-error-base)}.invisible[data-v-20130bd1]{visibility:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$b = "data-v-20130bd1";
/* module identifier */

var __vue_module_identifier__$7 = undefined;
/* functional template */

var __vue_is_functional_template__$b = false;
/* component normalizer */

function __vue_normalize__$b(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "Question.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$7() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$7.styles || (__vue_create_injector__$7.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var Question = __vue_normalize__$b({
  render: __vue_render__$b,
  staticRenderFns: __vue_staticRenderFns__$b
}, __vue_inject_styles__$b, __vue_script__$b, __vue_scope_id__$b, __vue_is_functional_template__$b, __vue_module_identifier__$7, __vue_create_injector__$7);

//

var resolveComponentName = function resolveComponentName(type) {
  return getComponentName(processAnswerType(type));
};

var WITH_FEEDBACK = ['MC', 'SC', 'TF'];
var TEXT_CONTAINERS$1 = ['JODIT_HTML', 'HTML'];
var validationOptions = {
  recursive: true,
  abortEarly: false
};
var script$a = {
  name: 'tce-question-container',
  inject: ['$teRegistry'],
  props: {
    element: {
      type: Object,
      required: true
    },
    isDisabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data(vm) {
    return {
      isEditing: !vm.element.id,
      editedElement: cloneDeep(vm.element),
      undoState: cloneDeep(vm.element),
      errors: [],
      alert: {}
    };
  },
  computed: {
    answerType: function answerType(vm) {
      return vm.element.data.type;
    },
    isGraded: function isGraded(vm) {
      return vm.element.type === 'ASSESSMENT';
    },
    showFeedback: function showFeedback(vm) {
      return WITH_FEEDBACK.includes(vm.answerType);
    },
    componentName: function componentName(vm) {
      return resolveComponentName(vm.answerType);
    },
    config: function config(vm) {
      return vm.$teRegistry.get(vm.answerType);
    },
    hintErrors: function hintErrors(vm) {
      return assessment.getErrorMessages(vm.errors, 'hint');
    },
    schema: function schema() {
      var schema = this.config.schema;
      return yup.object().shape(Object.assign({}, baseSchema, this.isGraded ? schema : omit(schema, ['correct'])));
    }
  },
  methods: {
    edit: function edit() {
      this.editedElement = cloneDeep(this.element);
      this.undoState = cloneDeep(this.element);
      this.isEditing = true;
    },
    update: function update(data, validate) {
      var _this = this;

      Object.assign(this.editedElement.data, data);

      if (validate && !isEmpty(this.errors)) {
        this.errors = [];
        this.validate()["catch"](function (err) {
          return _this.errors = err.inner;
        });
      }

      this.$emit('add', this.editedElement);
    },
    save: function save() {
      var _this2 = this;

      this.validate().then(function () {
        _this2.$emit('save', cloneDeep(_this2.editedElement.data));

        _this2.isEditing = false;
        _this2.errors = [];
      })["catch"](function (err) {
        return _this2.errors = err.inner;
      });
    },
    cancel: function cancel() {
      if (!this.editedElement.id) return this.$emit('delete');
      this.$emit('add', cloneDeep(this.undoState));
      this.editedElement = cloneDeep(this.undoState);
      this.isEditing = false;
      this.errors = [];
      this.alert = {};
    },
    validate: function validate() {
      return this.schema.validate(this.editedElement.data, validationOptions);
    },
    updateFeedback: function updateFeedback(data) {
      var element = this.editedElement;
      this.$set(element.data, 'feedback', Object.assign({}, element.data.feedback, data));
    }
  },
  components: {
    Controls: Controls,
    Feedback: Feedback,
    Question: Question
  }
};
var question = yup.array().test('has-text', 'Please define question', function (question) {
  return !!question.find(containsText);
});

function containsText(asset) {
  return TEXT_CONTAINERS$1.includes(asset.type) && asset.data.content && asset.data.content.trim().length > 0;
}

var baseSchema = {
  question: question,
  hint: yup.string().trim().max(500),
  _refs: yup.object().shape({
    objectiveId: yup.number().integer().positive()
  })
};

/* script */
var __vue_script__$a = script$a;
/* template */

var __vue_render__$a = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-card', {
    staticClass: "tce-question-container my-2 grey lighten-5"
  }, [_c('v-toolbar', {
    staticClass: "mb-5 px-0 elevation-2 text-left",
    attrs: {
      "color": "primary darken-3",
      "height": "36",
      "dark": ""
    }
  }, [_c('v-icon', {
    staticClass: "mr-2",
    attrs: {
      "color": "secondary lighten-2",
      "size": "18"
    }
  }, [_vm._v("mdi-help")]), _vm._v(" "), _c('span', {
    staticClass: "subtitle-2"
  }, [_vm._v(_vm._s(_vm.config.name))])], 1), _vm._v(" "), _vm._t("default", null, {
    "isEditing": _vm.isEditing
  }), _vm._v(" "), _c('div', {
    staticClass: "content"
  }, [_c('question', {
    attrs: {
      "assessment": _vm.editedElement,
      "is-editing": _vm.isEditing,
      "errors": _vm.errors
    },
    on: {
      "update": _vm.update
    }
  }), _vm._v(" "), _c(_vm.componentName, {
    tag: "component",
    staticClass: "tce-answer",
    attrs: {
      "assessment": _vm.editedElement.data,
      "is-editing": _vm.isEditing,
      "is-graded": _vm.isGraded,
      "errors": _vm.errors
    },
    on: {
      "update": _vm.update,
      "alert": function alert($event) {
        _vm.alert = $event;
      }
    }
  }), _vm._v(" "), _c('div', {
    staticClass: "subtitle-2 mb-2"
  }, [_vm._v("Hint")]), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "error-messages": _vm.hintErrors,
      "disabled": !_vm.isEditing,
      "placeholder": "Optional hint...",
      "color": "blue-darken darken-3",
      "filled": "",
      "clearable": ""
    },
    model: {
      value: _vm.editedElement.data.hint,
      callback: function callback($$v) {
        _vm.$set(_vm.editedElement.data, "hint", $$v);
      },
      expression: "editedElement.data.hint"
    }
  }), _vm._v(" "), _vm.showFeedback ? _c('feedback', {
    attrs: {
      "answers": _vm.editedElement.data.answers,
      "feedback": _vm.editedElement.data.feedback,
      "is-graded": _vm.isGraded,
      "is-editing": _vm.isEditing
    },
    on: {
      "update": _vm.updateFeedback
    }
  }) : _vm._e(), _vm._v(" "), _c('v-alert', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: _vm.alert.text,
      expression: "alert.text"
    }],
    staticClass: "mt-4",
    attrs: {
      "type": _vm.alert.type,
      "prominent": ""
    }
  }, [_vm._v("\n      " + _vm._s(_vm.alert.text) + "\n    ")]), _vm._v(" "), !_vm.isDisabled ? _c('controls', {
    staticClass: "controls",
    attrs: {
      "is-editing": _vm.isEditing
    },
    on: {
      "edit": _vm.edit,
      "save": _vm.save,
      "cancel": _vm.cancel
    }
  }) : _vm._e()], 1)], 2);
};

var __vue_staticRenderFns__$a = [];
/* style */

var __vue_inject_styles__$a = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-1a2f662a_0", {
    source: ".tce-question-container[data-v-1a2f662a]{min-height:25rem;background-color:#fff;overflow:visible;text-align:left}.tce-question-container[data-v-1a2f662a]  .title{font-weight:400}.tce-question-container .content[data-v-1a2f662a]{margin:.5rem 1.625rem}@media (max-width:1263px){.tce-question-container .content[data-v-1a2f662a]{margin:.5rem}}.tce-question-container .tce-answer[data-v-1a2f662a]{overflow:hidden}.disabled .controls[data-v-1a2f662a]{display:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$a = "data-v-1a2f662a";
/* module identifier */

var __vue_module_identifier__$6 = undefined;
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

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$6() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$6.styles || (__vue_create_injector__$6.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var TceQuestionContainer = __vue_normalize__$a({
  render: __vue_render__$a,
  staticRenderFns: __vue_staticRenderFns__$a
}, __vue_inject_styles__$a, __vue_script__$a, __vue_scope_id__$a, __vue_is_functional_template__$a, __vue_module_identifier__$6, __vue_create_injector__$6);

//
var TEXT_CONTAINERS = ['JODIT_HTML', 'HTML'];
var blankRegex = /(@blank)/g;
var htmlRegex = /(<\/?[^>]+(>|$))|&nbsp;/g;

var getTextAssets = function getTextAssets(item) {
  return filter(item, function (it) {
    return TEXT_CONTAINERS.includes(it.type);
  });
};

var script$9 = {
  name: 'tailor-assessment-item',
  inject: ['$teRegistry', '$editorState'],
  props: {
    assessment: {
      type: Object,
      required: true
    },
    expanded: {
      type: Boolean,
      "default": false
    },
    draggable: {
      type: Boolean,
      "default": false
    },
    isDisabled: {
      type: Boolean,
      "default": false
    }
  },
  data: function data() {
    return {
      hover: false
    };
  },
  computed: {
    elementConfig: function elementConfig() {
      return this.$teRegistry.get(this.assessment.data.type);
    },
    question: function question() {
      var textAssets = getTextAssets(this.assessment.data.question);
      var question = map(textAssets, 'data.content').join(' ');
      return question.replace(htmlRegex, '').replace(blankRegex, function () {
        return '____';
      });
    }
  },
  methods: {
    save: function save(data) {
      var assessment = cloneDeep(this.assessment);
      Object.assign(assessment.data, data);
      this.$emit('save', assessment);
    }
  },
  components: {
    PublishDiffChip: PublishDiffChip,
    TceQuestionContainer: TceQuestionContainer
  }
};

/* script */
var __vue_script__$9 = script$9;
/* template */

var __vue_render__$9 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('li', {
    staticClass: "list-group-item assessment-item elevation-1",
    "class": [_vm.assessment.changeSincePublish, {
      hover: _vm.hover,
      expanded: _vm.expanded,
      diff: _vm.$editorState.isPublishDiff
    }],
    on: {
      "mouseenter": function mouseenter($event) {
        _vm.hover = true;
      },
      "mouseleave": function mouseleave($event) {
        _vm.hover = false;
      }
    }
  }, [_vm.draggable ? _c('span', {
    staticClass: "drag-handle"
  }, [_c('v-icon', [_vm._v("mdi-drag-vertical")])], 1) : _vm._e(), _vm._v(" "), _vm.expanded ? _c('tce-question-container', {
    staticClass: "question-container",
    attrs: {
      "element": _vm.assessment,
      "is-disabled": _vm.isDisabled
    },
    on: {
      "save": _vm.save,
      "delete": function _delete($event) {
        return _vm.$emit('delete');
      }
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(ref) {
        var isEditing = ref.isEditing;
        return [_c('div', {
          staticClass: "px-6 d-flex justify-end"
        }, [_c('v-btn', {
          staticClass: "px-2",
          attrs: {
            "text": "",
            "small": ""
          },
          on: {
            "click": function click($event) {
              return _vm.$emit('selected');
            }
          }
        }, [_c('v-icon', {
          staticClass: "mr-2",
          attrs: {
            "dense": ""
          }
        }, [_vm._v("mdi-arrow-collapse")]), _vm._v("\n          Collapse\n        ")], 1)], 1), _vm._v(" "), _c('div', {
          staticClass: "d-flex pb-4 px-6"
        }, [_vm._t("header", null, {
          "isEditing": isEditing
        })], 2)];
      }
    }], null, true)
  }) : _c('div', {
    staticClass: "minimized d-flex justify-space-between align-center",
    on: {
      "click": function click($event) {
        return _vm.$emit('selected');
      }
    }
  }, [_c('v-chip', {
    staticClass: "readonly",
    attrs: {
      "color": "primary darken-3",
      "label": "",
      "dark": "",
      "small": ""
    }
  }, [_vm._v("\n      " + _vm._s(_vm.elementConfig.subtype) + "\n    ")]), _vm._v(" "), _c('span', {
    staticClass: "question"
  }, [_vm._v(_vm._s(_vm._f("truncate")(_vm.question, 50)))]), _vm._v(" "), _vm.$editorState.isPublishDiff && _vm.assessment.changeSincePublish ? _c('publish-diff-chip', {
    attrs: {
      "change-type": _vm.assessment.changeSincePublish
    }
  }) : _c('v-btn', {
    staticClass: "delete",
    "class": {
      disabled: _vm.isDisabled
    },
    attrs: {
      "color": "primary darken-2",
      "icon": ""
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.$emit('delete');
      }
    }
  }, [_c('v-icon', [_vm._v("mdi-close")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$9 = [];
/* style */

var __vue_inject_styles__$9 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-493c9656_0", {
    source: ".assessment-item[data-v-493c9656]{margin-bottom:.625rem;padding:0}.assessment-item .v-chip[data-v-493c9656]{min-width:1.875rem}.assessment-item .drag-handle[data-v-493c9656]{position:absolute;top:0;left:-3px;color:#888;font-size:28px;opacity:0;cursor:move}.assessment-item.hover .drag-handle[data-v-493c9656]{opacity:1;transition:opacity .6s ease-in-out}.assessment-item .minimized[data-v-493c9656]{padding:.375rem 1.375rem;cursor:pointer}.assessment-item .minimized .question[data-v-493c9656]{display:inline-block;max-width:80%;min-height:1.875rem;color:#444;font-size:1rem;font-weight:400;line-height:2.125rem}.assessment-item .minimized .v-chip[data-v-493c9656]{margin-top:.125rem}.assessment-item .delete[data-v-493c9656]{opacity:0}.assessment-item.hover:not(.sortable-chosen) .delete[data-v-493c9656]:not(.disabled){opacity:1}.question-container[data-v-493c9656]{margin:0!important}.diff[data-v-493c9656]{border:none}.diff.expanded[data-v-493c9656]{border-radius:4px}.diff.new[data-v-493c9656]{border:none;box-shadow:0 0 0 2px var(--v-success-lighten2)!important}.diff.changed[data-v-493c9656],.diff.removed[data-v-493c9656]{border:none;box-shadow:0 0 0 2px var(--v-secondary-lighten4)!important}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$9 = "data-v-493c9656";
/* module identifier */

var __vue_module_identifier__$5 = undefined;
/* functional template */

var __vue_is_functional_template__$9 = false;
/* component normalizer */

function __vue_normalize__$9(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "AssessmentItem.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$5() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$5.styles || (__vue_create_injector__$5.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var AssessmentItem = __vue_normalize__$9({
  render: __vue_render__$9,
  staticRenderFns: __vue_staticRenderFns__$9
}, __vue_inject_styles__$9, __vue_script__$9, __vue_scope_id__$9, __vue_is_functional_template__$9, __vue_module_identifier__$5, __vue_create_injector__$5);

var downloadMixin = {
  methods: {
    download: function download(url, fileName) {
      var a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.target = '_blank';
      a.click();
    }
  }
};

var uploadMixin = {
  inject: ['$storageService', '$repository'],
  mixins: [downloadMixin],
  data: function data() {
    return {
      uploading: false
    };
  },
  computed: {
    repositoryId: function repositoryId() {
      return this.$repository.id;
    }
  },
  methods: Object.assign({}, mapRequests('app', ['showConfirmationModal']), {
    createFileForm: function createFileForm(e) {
      this.form = new FormData();

      var _e$target$files = _slicedToArray(e.target.files, 1),
          file = _e$target$files[0];

      if (!file) return;
      this.form.append('file', file, file.name);
    },
    upload: loader(function (e) {
      var _this = this;

      this.createFileForm(e);
      return this.$storageService.upload(this.repositoryId, this.form).then(function (data) {
        var _this$form$get = _this.form.get('file'),
            name = _this$form$get.name;

        _this.$emit('upload', Object.assign({}, data, {
          name: name
        }));
      })["catch"](function () {
        _this.error = 'An error has occurred!';
      });
    }, 'uploading'),
    downloadFile: async function downloadFile(key, name) {
      var url = await this.$storageService.getUrl(this.repositoryId, key);
      return this.download(url, name);
    },
    deleteFile: function deleteFile(item) {
      var _this2 = this;

      this.showConfirmationModal({
        title: 'Delete file?',
        message: "Are you sure you want to remove ".concat(item.fileName, "?"),
        action: function action() {
          return _this2.$emit('delete', item.id, null);
        }
      });
    }
  })
};

//
var script$8 = {
  name: 'upload-btn',
  mixins: [uploadMixin],
  props: {
    id: {
      type: String,
      "default": function _default() {
        return uniqueId('file_');
      }
    },
    fileName: {
      type: String,
      "default": ''
    },
    fileKey: {
      type: String,
      "default": ''
    },
    validate: {
      type: Object,
      "default": function _default() {
        return {
          ext: []
        };
      }
    },
    label: {
      type: String,
      "default": 'Choose a file'
    },
    sm: {
      type: Boolean,
      "default": false
    }
  },
  methods: {
    validateAndUpload: async function validateAndUpload(e) {
      var _await$this$$refs$val = await this.$refs.validator.validate(e),
          valid = _await$this$$refs$val.valid;

      if (valid) this.upload(e);
    }
  },
  watch: {
    uploading: function uploading(val) {
      this.$emit('update:uploading', val);
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

  return _c('div', {
    staticClass: "file-upload"
  }, [_c('form', {
    staticClass: "upload-form",
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
      }
    }
  }, [_c('validation-provider', {
    ref: "validator",
    attrs: {
      "rules": _vm.validate
    }
  }, [_c('input', {
    ref: _vm.id,
    staticClass: "upload-input",
    attrs: {
      "id": _vm.id,
      "name": _vm.id,
      "accept": _vm.validate.ext,
      "type": "file"
    },
    on: {
      "change": _vm.validateAndUpload
    }
  })]), _vm._v(" "), !_vm.fileKey ? _c('v-btn', {
    attrs: {
      "loading": _vm.uploading,
      "color": "grey darken-4",
      "text": ""
    },
    on: {
      "click": function click($event) {
        return _vm.$refs[_vm.id].click();
      }
    }
  }, [_c('v-icon', {
    staticClass: "mr-2",
    attrs: {
      "color": "secondary"
    }
  }, [_vm._v("mdi-cloud-upload-outline")]), _vm._v("\n      " + _vm._s(_vm.label) + "\n    ")], 1) : _c('span', {
    staticClass: "file-name",
    on: {
      "click": function click($event) {
        return _vm.downloadFile(_vm.fileKey, _vm.fileName);
      }
    }
  }, [_vm._v(_vm._s(_vm.fileName) + "\n    ")]), _vm._v(" "), _vm.fileKey ? _c('v-btn', {
    attrs: {
      "icon": "",
      "small": ""
    },
    on: {
      "click": function click($event) {
        return _vm.deleteFile({
          id: _vm.id,
          fileName: _vm.fileName
        });
      }
    }
  }, [_c('v-icon', [_vm._v("mdi-delete")])], 1) : _vm._e()], 1)]);
};

var __vue_staticRenderFns__$8 = [];
/* style */

var __vue_inject_styles__$8 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-1f089141_0", {
    source: ".file-upload[data-v-1f089141],.upload-form[data-v-1f089141]{display:inline-block}.upload-input[data-v-1f089141]{visibility:hidden;max-width:0;max-height:0}.file-name[data-v-1f089141]{color:#00f;font-size:1rem;text-decoration:underline;cursor:pointer}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$8 = "data-v-1f089141";
/* module identifier */

var __vue_module_identifier__$4 = undefined;
/* functional template */

var __vue_is_functional_template__$8 = false;
/* component normalizer */

function __vue_normalize__$8(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "UploadBtn.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$4() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$4.styles || (__vue_create_injector__$4.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var UploadBtn = __vue_normalize__$8({
  render: __vue_render__$8,
  staticRenderFns: __vue_staticRenderFns__$8
}, __vue_inject_styles__$8, __vue_script__$8, __vue_scope_id__$8, __vue_is_functional_template__$8, __vue_module_identifier__$4, __vue_create_injector__$4);

//

function isUploaded(url) {
  try {
    return url && new URL(url).protocol === 'storage:';
  } catch (e) {
    return false;
  }
}

var script$7 = {
  name: 'tailor-asset-input',
  props: {
    url: {
      type: String,
      "default": null
    },
    publicUrl: {
      type: String,
      "default": null
    },
    extensions: {
      type: Array,
      required: true
    },
    allowFileUpload: {
      type: Boolean,
      "default": true
    },
    uploadLabel: {
      type: String,
      "default": 'Select file'
    }
  },
  data: function data() {
    var isLinked = !isUploaded(this.url);
    return {
      isEditing: !this.url,
      uploading: false,
      file: isLinked ? null : pick(this, ['url', 'publicUrl']),
      urlInput: isLinked ? this.url : null
    };
  },
  computed: {
    hasAsset: function hasAsset(vm) {
      return vm.file || vm.urlInput;
    },
    isLinked: function isLinked(vm) {
      return !!vm.urlInput;
    },
    hasChanges: function hasChanges(vm) {
      return vm.url !== (vm.isLinked ? vm.urlInput : get(vm, 'file.url', null));
    },
    fileName: function fileName() {
      if (!this.file) return null;
      return last(this.file.url.split('___'));
    }
  },
  methods: {
    save: async function save() {
      if (this.$refs.provider) {
        var _await$this$$refs$pro = await this.$refs.provider.validate(),
            valid = _await$this$$refs$pro.valid;

        if (!valid) return;
      }

      this.isEditing = false;
      var payload = this.file || {
        url: this.urlInput,
        publicUrl: this.urlInput
      };
      this.$emit('input', payload);
    },
    cancel: function cancel() {
      var isLinked = !isUploaded(this.url);
      this.urlInput = isLinked ? this.url : null;
      this.file = isLinked ? null : pick(this, ['url', 'publicUrl']);
      this.isEditing = !this.url;
    }
  },
  components: {
    UploadBtn: UploadBtn
  }
};

/* script */
var __vue_script__$7 = script$7;
/* template */

var __vue_render__$7 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-toolbar-items', [_vm.url && !_vm.isEditing ? _c('v-btn', {
    attrs: {
      "href": _vm.publicUrl || _vm.url,
      "target": "_blank",
      "color": "info",
      "text": ""
    }
  }, [_c('v-icon', [_vm._v("mdi-open-in-new")])], 1) : _vm._e(), _vm._v(" "), _vm.allowFileUpload ? _c('upload-btn', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: !_vm.file && _vm.isEditing,
      expression: "!file && isEditing"
    }],
    staticClass: "upload-btn",
    attrs: {
      "uploading": _vm.uploading,
      "validate": {
        ext: _vm.extensions
      },
      "confirm-deletion": false,
      "label": _vm.uploadLabel
    },
    on: {
      "upload": function upload(val) {
        return (_vm.file = val) && (_vm.urlInput = null);
      },
      "update:uploading": function updateUploading($event) {
        _vm.uploading = $event;
      }
    }
  }) : _vm._e(), _vm._v(" "), _vm.file ? [_vm.isEditing ? _c('v-btn', {
    attrs: {
      "color": "red",
      "text": ""
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        _vm.file = null;
      }
    }
  }, [_c('v-icon', [_vm._v("mdi-delete")])], 1) : _vm._e(), _vm._v(" "), _c('v-text-field', {
    attrs: {
      "value": _vm.fileName,
      "readonly": "",
      "hide-details": "",
      "filled": ""
    }
  })] : _vm._e(), _vm._v(" "), !_vm.uploading && (_vm.urlInput || !_vm.hasAsset) ? _c('validation-provider', {
    ref: "provider",
    attrs: {
      "rules": {
        url: {
          protocols: ['http', 'https'],
          require_protocol: true,
          require_valid_protocol: true
        }
      },
      "name": "URL"
    },
    scopedSlots: _vm._u([{
      key: "default",
      fn: function fn(ref) {
        var errors = ref.errors;
        return [_c('v-text-field', {
          attrs: {
            "error-messages": errors,
            "disabled": !_vm.isEditing,
            "placeholder": _vm.allowFileUpload ? 'or paste a URL...' : 'Paste a URL...',
            "filled": "",
            "clearable": ""
          },
          model: {
            value: _vm.urlInput,
            callback: function callback($$v) {
              _vm.urlInput = $$v;
            },
            expression: "urlInput"
          }
        })];
      }
    }], null, false, 17370557)
  }) : _vm._e(), _vm._v(" "), !_vm.isEditing ? _c('v-btn', {
    staticClass: "action",
    attrs: {
      "text": ""
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        _vm.isEditing = true;
      }
    }
  }, [_vm._v("\n    Edit\n  ")]) : [_vm.hasChanges ? _c('v-btn', {
    staticClass: "action",
    attrs: {
      "disabled": _vm.uploading,
      "text": ""
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.save($event);
      }
    }
  }, [_vm._v("\n      Save\n    ")]) : _vm._e(), _vm._v(" "), _vm.hasChanges || _vm.url ? _c('v-btn', {
    staticClass: "action",
    attrs: {
      "disabled": _vm.uploading,
      "text": ""
    },
    on: {
      "click": function click($event) {
        $event.stopPropagation();
        return _vm.cancel($event);
      }
    }
  }, [_vm._v("\n      Cancel\n    ")]) : _vm._e()]], 2);
};

var __vue_staticRenderFns__$7 = [];
/* style */

var __vue_inject_styles__$7 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-00f47ac8_0", {
    source: ".v-text-field[data-v-00f47ac8]{min-width:21.875rem;margin:.5rem .75rem 0 1.75rem}.action[data-v-00f47ac8]  .v-btn__content{min-width:4rem!important}.upload-btn[data-v-00f47ac8]  .v-btn{height:100%}.upload-btn[data-v-00f47ac8]  .v-btn .v-btn__content{padding:1.5rem 0}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$7 = "data-v-00f47ac8";
/* module identifier */

var __vue_module_identifier__$3 = undefined;
/* functional template */

var __vue_is_functional_template__$7 = false;
/* component normalizer */

function __vue_normalize__$7(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "AssetInput.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$3() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$3.styles || (__vue_create_injector__$3.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var AssetInput = __vue_normalize__$7({
  render: __vue_render__$7,
  staticRenderFns: __vue_staticRenderFns__$7
}, __vue_inject_styles__$7, __vue_script__$7, __vue_scope_id__$7, __vue_is_functional_template__$7, __vue_module_identifier__$3, __vue_create_injector__$3);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
var script$6 = {
  name: 'date-picker',
  props: {
    value: {
      type: [String, Date],
      "default": null
    },
    label: {
      type: String,
      "default": null
    },
    clearable: {
      type: Boolean,
      "default": true
    },
    placeholder: {
      type: String,
      "default": 'Click to set...'
    }
  },
  data: function data() {
    return {
      showDatePicker: false
    };
  },
  methods: {
    clear: function clear() {
      this.$emit('input', null);
      this.$refs.textField.blur();
    }
  }
};

/* script */
var __vue_script__$6 = script$6;
/* template */

var __vue_render__$6 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('v-menu', {
    attrs: {
      "close-on-content-click": false,
      "min-width": "290px",
      "transition": "scale-transition"
    },
    scopedSlots: _vm._u([{
      key: "activator",
      fn: function fn(ref) {
        var on = ref.on;
        return [_c('v-text-field', _vm._g({
          ref: "textField",
          attrs: {
            "value": _vm._f("formatDate")(_vm.value, 'MMM D, YYYY'),
            "label": _vm.label,
            "placeholder": _vm.placeholder,
            "clearable": _vm.clearable,
            "outlined": "",
            "readonly": ""
          },
          on: {
            "click:clear": _vm.clear,
            "click": function click($event) {
              _vm.showDatePicker = true;
            }
          }
        }, on))];
      }
    }]),
    model: {
      value: _vm.showDatePicker,
      callback: function callback($$v) {
        _vm.showDatePicker = $$v;
      },
      expression: "showDatePicker"
    }
  }, [_vm._v(" "), _c('v-date-picker', {
    attrs: {
      "value": _vm._f("formatDate")(_vm.value, 'YYYY-MM-DD'),
      "color": "primary darken-2",
      "no-title": ""
    },
    on: {
      "input": function input($event) {
        return _vm.$emit('input', $event);
      },
      "change": function change($event) {
        _vm.showDatePicker = false;
      }
    }
  })], 1);
};

var __vue_staticRenderFns__$6 = [];
/* style */

var __vue_inject_styles__$6 = undefined;
/* scoped */

var __vue_scope_id__$6 = undefined;
/* functional template */

var __vue_is_functional_template__$6 = false;
/* component normalizer */

function __vue_normalize__$6(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "DatePicker.vue";

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


var DatePicker = __vue_normalize__$6({
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
      "default": function _default() {
        return [];
      }
    },
    dragOptions: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    supportedTypes: {
      type: Array,
      "default": null
    },
    activity: {
      type: Object,
      "default": null
    },
    layout: {
      type: Boolean,
      "default": false
    },
    isDisabled: {
      type: Boolean,
      "default": false
    },
    enableAdd: {
      type: Boolean,
      "default": true
    },
    addElementOptions: {
      type: Object,
      "default": function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      dragElementIndex: null
    };
  },
  computed: Object.assign({}, mapChannels({
    editorChannel: 'editor'
  }), {
    options: function options(vm) {
      return Object.assign({}, vm.dragOptions, {
        handle: '.drag-handle'
      });
    }
  }),
  methods: {
    get: get,
    getElementId: getElementId,
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
    Draggable: Draggable
  }
};

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
      "class": "col-xs-" + _vm.get(element, 'data.width', 12),
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

var __vue_inject_styles__$5 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-504ada5e_0", {
    source: ".list-group[data-v-504ada5e]{padding:.625rem 1.5rem}[data-v-504ada5e] .sortable-ghost .drag-handle{display:none}[data-v-504ada5e] .sortable-ghost .content-element{max-height:9.375rem;background:#f4f5f5}[data-v-504ada5e] .sortable-ghost .content-element>*{visibility:hidden}[data-v-504ada5e] .sortable-drag .content-element{max-height:auto;background:#fff}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$5 = "data-v-504ada5e";
/* module identifier */

var __vue_module_identifier__$2 = undefined;
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

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$2() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$2.styles || (__vue_create_injector__$2.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var ElementList = __vue_normalize__$5({
  render: __vue_render__$5,
  staticRenderFns: __vue_staticRenderFns__$5
}, __vue_inject_styles__$5, __vue_script__$5, __vue_scope_id__$5, __vue_is_functional_template__$5, __vue_module_identifier__$2, __vue_create_injector__$2);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
      "default": 'Select to edit'
    },
    activePlaceholder: {
      type: String,
      "default": 'Use toolbar to edit'
    },
    activeIcon: {
      type: String,
      "default": null
    },
    activeColor: {
      type: String,
      "default": '#fff'
    },
    isDisabled: {
      type: Boolean,
      "default": false
    },
    isFocused: {
      type: Boolean,
      "default": false
    },
    dense: {
      type: Boolean,
      "default": false
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
    "class": _vm.dense ? 'pt-3' : 'pa-12'
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
    "class": [_vm.isDisabled ? 'text--darken-3' : 'text--darken-4', _vm.dense ? 'my-2 subtitle-2' : 'my-4 headline']
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
      "default": function _default() {
        return ['JODIT_HTML', 'IMAGE', 'HTML', 'VIDEO'];
      }
    },
    isDisabled: {
      type: Boolean,
      "default": false
    },
    addElementOptions: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    enableAdd: {
      type: Boolean,
      "default": true
    }
  },
  computed: {
    embeds: function embeds() {
      var items = this.container.embeds;
      return items ? values(items).sort(function (a, b) {
        return a.position - b.position;
      }) : [];
    }
  },
  methods: Object.assign({}, mapRequests('app', ['showConfirmationModal']), {
    addItems: function addItems(items) {
      items = Array.isArray(items) ? items : [items];
      var container = cloneDeep(this.container);
      container.embeds = Object.assign({}, container.embeds, mapKeys(items, 'id'));
      this.$emit('save', container);
    },
    reorderItem: function reorderItem(_ref) {
      var newPosition = _ref.newPosition,
          items = _ref.items;
      var context = {
        items: items,
        newPosition: newPosition
      };
      var container = cloneDeep(this.container);
      var reordered = container.embeds[items[newPosition].id];
      reordered.position = calculatePosition(context);
      this.$emit('save', container);
    },
    save: function save(item, key, value) {
      var container = cloneDeep(this.container);
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
var script$2 = {
  name: 'file-input',
  mixins: [upload],
  props: {
    id: {
      type: String,
      "default": function _default() {
        return uniqueId('file_');
      }
    },
    fileKey: {
      type: String,
      "default": ''
    },
    fileName: {
      type: String,
      "default": ''
    },
    validate: {
      type: Object,
      "default": function _default() {
        return {
          ext: []
        };
      }
    },
    label: {
      type: String,
      "default": 'File upload'
    },
    placeholder: {
      type: String,
      "default": 'Choose a file'
    },
    outlined: {
      type: Boolean,
      "default": false
    },
    dense: {
      type: Boolean,
      "default": false
    }
  },
  computed: {
    acceptedFileTypes: function acceptedFileTypes() {
      var ext = get(this.validate, 'ext', []);
      return ext.length ? ".".concat(ext.join(',.')) : '';
    }
  },
  watch: {
    uploading: function uploading(val) {
      this.$emit('update:uploading', val);
    }
  }
};

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('form', {
    on: {
      "submit": function submit($event) {
        $event.preventDefault();
      }
    }
  }, [!_vm.fileKey ? _c('v-file-input', {
    ref: _vm.id,
    attrs: {
      "accept": _vm.acceptedFileTypes,
      "label": _vm.label,
      "placeholder": _vm.placeholder,
      "outlined": _vm.outlined,
      "dense": _vm.dense,
      "clearable": false,
      "append-icon": _vm.uploading ? 'mdi-loading mdi-spin' : 'mdi-upload',
      "prepend-icon": ""
    },
    on: {
      "click:append": function clickAppend($event) {
        _vm.$refs[_vm.id].$el.querySelector('input').click();
      }
    },
    nativeOn: {
      "change": function change($event) {
        return _vm.upload($event);
      }
    }
  }) : _c('div', {
    staticClass: "mb-5 px-1 grey--text text--darken-3"
  }, [_c('div', [_vm._v(_vm._s(_vm.label))]), _vm._v(" "), _c('v-btn', {
    staticClass: "grey--text text--darken-4 text-none px-0",
    attrs: {
      "text": ""
    },
    on: {
      "click": function click($event) {
        return _vm.downloadFile(_vm.fileKey, _vm.fileName);
      }
    }
  }, [_vm._v("\n      " + _vm._s(_vm._f("truncate")(_vm.fileName, 35)) + "\n    ")]), _vm._v(" "), _c('v-btn', {
    staticClass: "ml-1",
    attrs: {
      "color": "grey darken-4",
      "icon": "",
      "x-small": ""
    },
    on: {
      "click": function click($event) {
        return _vm.deleteFile({
          id: _vm.id,
          fileName: _vm.fileName
        });
      }
    }
  }, [_c('v-icon', [_vm._v("mdi-close")])], 1)], 1)], 1);
};

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = undefined;
/* functional template */

var __vue_is_functional_template__$2 = false;
/* component normalizer */

function __vue_normalize__$2(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "FileInput.vue";

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


var FileInput = __vue_normalize__$2({
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
//
//
//
//
//
var script$1 = {
  name: 'tailor-inline-activator',
  inheritAttrs: false,
  props: {
    disabled: {
      type: Boolean,
      required: false
    }
  }
};

/* script */
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('button', _vm._g({
    staticClass: "inline-activator",
    "class": {
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

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-64eb8c58_0", {
    source: ".default-activator-state[data-v-64eb8c58],.inline-activator[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{padding:0 3.125rem;opacity:0}.inline-activator[data-v-64eb8c58]{display:flex;align-items:center;width:100%;margin:0;padding:0 3.125rem;opacity:0;transition:opacity .3s,padding .3s}.inline-activator[data-v-64eb8c58],.inline-activator .v-chip[data-v-64eb8c58]{cursor:pointer}.inline-activator hr[data-v-64eb8c58]{flex:1;display:inline-flex;margin:0;border-top:.0625rem dashed var(--v-primary-darken3)}.inline-activator[data-v-64eb8c58]:focus,.inline-activator[data-v-64eb8c58]:hover{padding:.75rem 0;opacity:1;outline:0;transition:opacity .3s .25s,padding .3s .1s}.inline-activator.disabled[data-v-64eb8c58],.inline-activator.disabled[data-v-64eb8c58]:hover{pointer-events:none}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__$1 = "data-v-64eb8c58";
/* module identifier */

var __vue_module_identifier__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* component normalizer */

function __vue_normalize__$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
  var component = (typeof script === 'function' ? script.options : script) || {}; // For security concerns, we use only base name in production mode.

  component.__file = "InlineActivator.vue";

  if (!component.render) {
    component.render = template.render;
    component.staticRenderFns = template.staticRenderFns;
    component._compiled = true;
    if (functional) component.functional = true;
  }

  component._scopeId = scope;

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__$1() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__$1.styles || (__vue_create_injector__$1.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var InlineActivator = __vue_normalize__$1({
  render: __vue_render__$1,
  staticRenderFns: __vue_staticRenderFns__$1
}, __vue_inject_styles__$1, __vue_script__$1, __vue_scope_id__$1, __vue_is_functional_template__$1, __vue_module_identifier__$1, __vue_create_injector__$1);

//
//
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
      "default": false
    }
  }
};

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

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-20303d2e_0", {
    source: ".message[data-v-20303d2e]{border-radius:2px;font-size:1.125rem}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-20303d2e";
/* module identifier */

var __vue_module_identifier__ = undefined;
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

  {
    var hook;

    if (style) {
      hook = function hook(context) {
        style.call(this, createInjector(context));
      };
    }

    if (hook !== undefined) {
      if (component.functional) {
        // register for functional component in vue file
        var originalRender = component.render;

        component.render = function renderWithStyleInjection(h, context) {
          hook.call(context);
          return originalRender(h, context);
        };
      } else {
        // inject component registration as beforeCreate hook
        var existing = component.beforeCreate;
        component.beforeCreate = existing ? [].concat(existing, hook) : [hook];
      }
    }
  }

  return component;
}
/* style inject */


function __vue_create_injector__() {
  var head = document.head || document.getElementsByTagName('head')[0];
  var styles = __vue_create_injector__.styles || (__vue_create_injector__.styles = {});
  var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
  return function addStyle(id, css) {
    if (document.querySelector('style[data-vue-ssr-id~="' + id + '"]')) return; // SSR styles are present.

    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = {
      ids: [],
      parts: [],
      element: undefined
    });

    if (!style.ids.includes(id)) {
      var code = css.source;
      var index = style.ids.length;
      style.ids.push(id);

      if (css.map) {
        // https://developer.chrome.com/devtools/docs/javascript-debugging
        // this makes source maps inside style tags work properly in Chrome
        code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

        code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
      }

      if (isOldIE) {
        style.element = style.element || document.querySelector('style[data-group=' + group + ']');
      }

      if (!style.element) {
        var el = style.element = document.createElement('style');
        el.type = 'text/css';
        if (css.media) el.setAttribute('media', css.media);

        if (isOldIE) {
          el.setAttribute('data-group', group);
          el.setAttribute('data-next-index', '0');
        }

        head.appendChild(el);
      }

      if (isOldIE) {
        index = parseInt(style.element.getAttribute('data-next-index'));
        style.element.setAttribute('data-next-index', index + 1);
      }

      if (style.element.styleSheet) {
        style.parts.push(code);
        style.element.styleSheet.cssText = style.parts.filter(Boolean).join('\n');
      } else {
        var textNode = document.createTextNode(code);
        var nodes = style.element.childNodes;
        if (nodes[index]) style.element.removeChild(nodes[index]);
        if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
      }
    }
  };
}
/* style inject SSR */


var PreviewOverlay = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, __vue_create_injector__);

export { ActiveUsers, AddElement, AssessmentItem, AssetInput, ContainedContent, ContentElement$1 as ContentElement, DatePicker, Discussion$1 as Discussion, ElementList, ElementPlaceholder, EmbeddedContainer, FileInput, InlineActivator, InputError, PreviewOverlay, PublishDiffChip, TceQuestionContainer as QuestionContainer, SelectElement, UploadBtn, uploadMixin as upload };
