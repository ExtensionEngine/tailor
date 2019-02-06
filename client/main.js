import 'babel-polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import 'event-source-polyfill';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'vue-directive-tooltip/css/index.css';

import Assessment from 'tce-core/Assessment';
import ElementRegistry from './ElementRegistry';
import Timeago from 'vue-timeago';
import Tooltip from 'vue-directive-tooltip';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';
import App from './App';

Vue.component('te-assessment', Assessment);

const registry = new ElementRegistry(Vue);
[
  'tce-html',
  'tce-image',
  'tce-video',
  'tce-embed',
  'tce-audio',
  'tce-page-break',
  'tce-pdf',
  'tce-accordion',
  'tce-table',
  'tce-modal',
  'tce-carousel',
  'tce-brightcove-video',
  'tce-multiple-choice',
  'tce-single-choice',
  'tce-true-false',
  'tce-text-response',
  'tce-numerical-response',
  'tce-fill-blank',
  'tce-matching-question',
  'tce-drag-drop'
].forEach(tailorElement => registry.load(tailorElement));

Vue.use(Tooltip, { delay: 50 });
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
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
  render: h => h(App),
  provide() {
    return {
      $teRegistry: registry
    };
  }
});
