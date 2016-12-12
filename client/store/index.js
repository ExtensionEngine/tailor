import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import auth from './modules/auth';
import activities from './modules/activities';
import settings from '../settings';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];
const modules = { auth, activities };

export default new Vuex.Store({
  middlewares,
  modules,
  strict: isDevEnv
});
