import Vue from 'vue';
import { sync } from 'vuex-router-sync';

// NOTE: Is there another way?
import '../node_modules/bootstrap-sass/assets/javascripts/bootstrap';

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
