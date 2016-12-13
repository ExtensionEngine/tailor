import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import activities from './modules/activities';
import auth from './modules/auth';
import courses from './modules/courses';
import users from './modules/users';
import settings from '../settings';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];
const modules = { activities, auth, courses, users };

export default new Vuex.Store({
  middlewares,
  modules,
  strict: isDevEnv
});
