import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import router from './router';
import store from './store';
import App from './App';

sync(store, router);

/* eslint-disable no-new */
new Vue({
  router,
  store,
  el: '#app',
  template: '<App/>',
  components: { App }
});
