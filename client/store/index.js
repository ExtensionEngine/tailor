import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import activities from './modules/activities';
import auth from './modules/auth';
import courses from './modules/courses';
import editor from './modules/editor';
import users from './modules/users';
import settings from '../settings';
import plugins from './plugins';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];
const modules = { activities, auth, courses, editor, users };

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});
