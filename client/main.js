/* eslint-disable sort-imports */
import './polyfills';
import 'bootstrap-sass/assets/javascripts/bootstrap';
import '@/utils/validation';

import assetsApi from '@/api/asset';
import ContentPluginRegistry from './content-plugins';

import { formatDate, truncate } from '@/filters';
import {
  setInteractionMode,
  ValidationObserver,
  ValidationProvider
} from 'vee-validate';
import FileFilter from '@/directives/file-filter';
import QuestionContainer from 'tce-core/QuestionContainer';
import request from './api/request';
import { sync } from 'vuex-router-sync';
import Radio from '@/plugins/radio';
import Timeago from 'vue-timeago';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueCroppa from 'vue-croppa';
import VueHotkey from 'v-hotkey';
import vuetify from '@/plugins/vuetify';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
setInteractionMode('eager');

Vue.filter('formatDate', formatDate);
Vue.filter('truncate', truncate);

Vue.use(Radio);
Vue.use(FileFilter);
Vue.use(VueHotkey);
Vue.use(VueClipboard);
Vue.use(VueCroppa);
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
