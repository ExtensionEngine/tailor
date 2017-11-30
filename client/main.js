import 'babel-polyfill';

import Timeago from 'vue-timeago';
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

Vue.use(Timeago, {
  locale: 'en-US',
  locales: {
    'en-US': require('vue-timeago/locales/en-US.json')
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
