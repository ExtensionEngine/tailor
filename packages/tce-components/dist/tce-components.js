'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var capitalize = require('lodash/capitalize');
var styleInject = require('../node_modules/style-inject/dist/style-inject.es.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var capitalize__default = /*#__PURE__*/_interopDefaultLegacy(capitalize);
var styleInject__default = /*#__PURE__*/_interopDefaultLegacy(styleInject);

//
var script = {
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

var css_248z = ".avatar[data-v-15a1beec]{transition:all .2s}.avatar img[data-v-15a1beec]{padding:.125rem}.avatar[data-v-15a1beec]:focus-within,.avatar[data-v-15a1beec]:hover{transform:scale(1.1);z-index:1}.avatar:focus-within img[data-v-15a1beec]:focus,.avatar:hover img[data-v-15a1beec]:focus{outline:0}";
styleInject__default['default'](css_248z);

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
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

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = undefined;
/* scoped */

var __vue_scope_id__ = "data-v-15a1beec";
/* functional template */

var __vue_is_functional_template__ = false;
/* component normalizer */

function __vue_normalize__(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var ActiveUsers = __vue_normalize__({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
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
var __vue_script__$1 = script$1;
/* template */

var __vue_render__$1 = function __vue_render__() {
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

var __vue_staticRenderFns__$1 = [];
/* style */

var __vue_inject_styles__$1 = undefined;
/* scoped */

var __vue_scope_id__$1 = undefined;
/* functional template */

var __vue_is_functional_template__$1 = false;
/* component normalizer */

function __vue_normalize__$1(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var ElementPlaceholder = __vue_normalize__$1({
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
var script$2 = {
  name: 'tce-preview-overlay',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
};

var css_248z$1 = ".message[data-v-4e41c6e0]{border-radius:2px;font-size:1.125rem}";
styleInject__default['default'](css_248z$1);

/* script */
var __vue_script__$2 = script$2;
/* template */

var __vue_render__$2 = function __vue_render__() {
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

var __vue_staticRenderFns__$2 = [];
/* style */

var __vue_inject_styles__$2 = undefined;
/* scoped */

var __vue_scope_id__$2 = "data-v-4e41c6e0";
/* functional template */

var __vue_is_functional_template__$2 = false;
/* component normalizer */

function __vue_normalize__$2(template, style, script, scope, functional, moduleIdentifier, createInjector, createInjectorSSR) {
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


var PreviewOverlay = __vue_normalize__$2({
  render: __vue_render__$2,
  staticRenderFns: __vue_staticRenderFns__$2
}, __vue_inject_styles__$2, __vue_script__$2, __vue_scope_id__$2, __vue_is_functional_template__$2);

exports.ActiveUsers = ActiveUsers;
exports.ElementPlaceholder = ElementPlaceholder;
exports.PreviewOverlay = PreviewOverlay;
