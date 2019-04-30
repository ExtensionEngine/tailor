import '@babel/polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import 'event-source-polyfill';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'vue-directive-tooltip/css/index.css';

import assetsApi from '@/api/asset';
import ElementRegistry from './ElementRegistry';
import FileFilter from '@/directives/file-filter';
import QuestionContainer from 'tce-core/QuestionContainer';
import Timeago from 'vue-timeago';
import Tooltip from 'vue-directive-tooltip';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import VueCroppa from 'vue-croppa';
import VueHotkey from 'v-hotkey';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);

const registry = new ElementRegistry(Vue);
registry.initialize();

Vue.use(FileFilter);
Vue.use(VueHotkey);
Vue.use(Vuetify, { iconfont: 'mdi' });
Vue.use(VuetifySnackbar);
Vue.use(Tooltip, { delay: 50 });
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(VueCroppa);

Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('@/assets/locales/timeago-en-US-short.json')
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
      $teRegistry: registry,
      $storageService: assetsApi
    };
  }
});
