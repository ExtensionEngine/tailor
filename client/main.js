/* eslint-disable sort-imports */
import './polyfills';
import 'bootstrap-sass/assets/javascripts/bootstrap';

import assetsApi from '@/api/asset';
import colors from 'vuetify/es5/util/colors';
import ContentPluginRegistry from './content-plugins';

import { formatDate, truncate } from '@/filters';
import FileFilter from '@/directives/file-filter';
import QuestionContainer from 'tce-core/QuestionContainer';
import request from './api/request';
import { sync } from 'vuex-router-sync';
import Timeago from 'vue-timeago';
import VeeValidate from './utils/validation';
import Vue from 'vue';
import VueCroppa from 'vue-croppa';
import VueHotkey from 'v-hotkey';
import Vuetify from 'vuetify';
import VuetifySnackbar from '@/plugins/vuetify-snackbar';

import store from './store';
import router from './router';
import App from './App';

Vue.component('tce-question-container', QuestionContainer);
Vue.filter('formatDate', formatDate);
Vue.filter('truncate', truncate);
Vue.use(FileFilter);
Vue.use(VueHotkey);
Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    primary: colors.blueGrey.darken2,
    secondary: colors.pink
  },
  options: {
    customProperties: true
  }
});
Vue.use(VuetifySnackbar);
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

request.setStorageInterface({
  getToken: () => store.getters.token,
  clearAuthData: () => store.dispatch('logout')
});

const contentPluginRegistry = new ContentPluginRegistry(Vue);
contentPluginRegistry.initialize().then(() => {
  sync(store, router);
  /* eslint-disable no-new */
  new Vue({
    router,
    store,
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
