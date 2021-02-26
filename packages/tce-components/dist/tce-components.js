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

exports.ActiveUsers = ActiveUsers;
