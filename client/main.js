import '@babel/polyfill';
import 'dom-shims/shim/Element.classList';
import 'dom-shims/shim/Element.mutation';
import 'event-source-polyfill';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import 'vue-directive-tooltip/css/index.css';

import * as asset from '@/api/asset';
import AssetLink from './plugins/asset/link';
import AssetUpload from './plugins/asset/upload';
import ElementRegistry from './ElementRegistry';
import QuestionContainer from 'tce-core/QuestionContainer';
import ResourceComponents from './plugins/resource-components';
import Timeago from 'vue-timeago';
import Tooltip from 'vue-directive-tooltip';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import VueHotkey from 'v-hotkey';
import Vuetify from 'vuetify';
import { sync } from 'vuex-router-sync';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);

const registry = new ElementRegistry(Vue);
registry.initialize();

Vue.use(ResourceComponents, {
  auth: () => localStorage.getItem('JWT_TOKEN')
});

Vue.use(AssetLink, {
  apiUrl: asset.apiUrl,
  defaultProtocol: asset.protocol
});
Vue.use(AssetUpload, {
  apiUrl: asset.apiUrl,
  upload: asset.upload,
  getUploadConfig: () => asset.getUploadConfig({ direct: false }),
  defaultTag: 'v-btn'
});

Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('@/assets/locales/timeago-en-US-short.json')
  }
});
Vue.use(Tooltip, { delay: 50 });
Vue.use(VueHotkey);
Vue.use(Vuetify, { iconfont: 'mdi' });
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});

sync(store, router);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  provide: () => ({ $teRegistry: registry })
});
