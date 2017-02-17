import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import activity from './modules/activity';
import assessments from './modules/assessments';
import assets from './modules/assets';
import atom from './modules/atom';
import auth from './modules/auth';
import courses from './modules/courses';
import editor from './modules/editor';
import revisions from './modules/revisions';

import plugins from './plugins';
import settings from '../settings';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];

const modules = {
  activity,
  assessments,
  assets,
  atom,
  auth,
  courses,
  editor,
  revisions
};

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});
