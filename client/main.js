/* eslint-disable sort-imports */
import './polyfills';
import '@/utils/validation';

import { asset as assetApi, exposedApi } from '@/api';
import { SCHEMAS, schema } from 'tailor-config';
import { QuestionContainer } from '@tailor-cms/core-components';
import ContentPluginRegistry from './content-plugins';

import { formatDate, truncate } from '@/filters';
import {
  setInteractionMode,
  ValidationObserver,
  ValidationProvider
} from 'vee-validate';
import FileFilter from '@/directives/file-filter';
import OidcClient from './OidcClient';
import Radio from '@extensionengine/vue-radio';
import { sync } from 'vuex-router-sync';
import Timeago from 'vue-timeago';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
import VueCroppa from 'vue-croppa';
import vuetify from '@/plugins/vuetify';

import enUsLocale from '@/assets/locales/timeago-en-US-short.json';
import getStore from './store';
import getRouter from './router';
import App from './App.vue';

Vue.component('tce-question-container', QuestionContainer);
Vue.component('validation-observer', ValidationObserver);
Vue.component('validation-provider', ValidationProvider);
setInteractionMode('eager');

Vue.filter('formatDate', formatDate);
Vue.filter('truncate', truncate);

Vue.use(Radio);
Vue.use(FileFilter);
Vue.use(VueClipboard);
Vue.use(VueCroppa);
Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': enUsLocale
  }
});

Vue.use(OidcClient);

const contentPluginRegistry = new ContentPluginRegistry(Vue);

Promise.all([getStore(), contentPluginRegistry.initialize()])
  .then(([store]) => {
    const router = getRouter();
    sync(store, router);
    /* eslint-disable no-new */
    const app = new Vue({
      router,
      store,
      vuetify,
      el: '#app',
      render: h => h(App),
      provide() {
        return {
          $api: exposedApi,
          $storageService: assetApi,
          $teRegistry: contentPluginRegistry.elementRegistry,
          $ccRegistry: contentPluginRegistry.containerRegistry,
          $schemaService: schema,
          $getCurrentUser: () => store.state.auth.user
        };
      }
    });
    if (window.Cypress) {
      window.__app__ = app;
      window.__test_schema_id__ = SCHEMAS[0].id;
    }
  });
