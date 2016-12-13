import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import auth from './modules/auth';
import courses from './modules/courses';
import activities from './modules/activities';
import settings from '../settings';
import plugins from './plugins';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];
const modules = { activities, auth, courses };

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: isDevEnv
});
