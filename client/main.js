import 'babel-polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';

import VeeValidate from './utils/validation';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';

// NOTE: Is there another way?
import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap';

import store from './store';
import router from './router';
import App from './App';

Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors'
});

sync(store, router);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
