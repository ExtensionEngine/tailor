/* eslint-disable sort-imports */
import './polyfills';

import assetsApi from '@/api/asset';
import ContentPluginRegistry from './content-plugins';

import { formatDate, truncate } from '@/filters';
import FileFilter from '@/directives/file-filter';
import QuestionContainer from 'tce-core/QuestionContainer';
import request from './api/request';
import { sync } from 'vuex-router-sync';
import Timeago from 'vue-timeago';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueCroppa from 'vue-croppa';
import VueHotkey from 'v-hotkey';
import vuetify from '@/plugins/vuetify';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);
Vue.filter('formatDate', formatDate);
Vue.filter('truncate', truncate);

Vue.use(FileFilter);
Vue.use(VueHotkey);
Vue.use(VueClipboard);
Vue.use(VueCroppa);
Vue.use(VeeValidate, {
  delay: 700,
  fieldsBagName: 'vFields',
  errorBagName: 'vErrors',
  inject: false
});
Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('@/assets/locales/timeago-en-US-short.json')
  }
});

Object.defineProperty(request, 'token', {
  get: () => store.state.auth.token,
  set: value => !value && store.dispatch('logout')
});

const contentPluginRegistry = new ContentPluginRegistry(Vue);
contentPluginRegistry.initialize().then(() => {
  sync(store, router);
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
    vuetify,
    el: '#app',
    render: h => h(App),
    provide() {
      return {
        $teRegistry: contentPluginRegistry.elementRegistry,
        $ccRegistry: contentPluginRegistry.containerRegistry,
        $storageService: assetsApi
      };
    }
  });
});
