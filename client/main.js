import 'babel-polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import 'event-source-polyfill';

import Timeago from 'vue-timeago';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import Tooltip from 'vue-directive-tooltip';

import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'vue-directive-tooltip/css/index.css';

import store from './store';
import router from './router';
import App from './App';

Vue.use(Tooltip, { delay: 50 });
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors'
});

Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('assets/locales/timeago-en-US-short.json')
  }
});

sync(store, router);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App)
});
