import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';

import activities from './modules/activities';
import auth from './modules/auth';
import comments from './modules/comments';
import course from './modules/course';
import courses from './modules/courses';
import editor from './modules/editor';
import editors from './modules/editors';
import revisions from './modules/revisions';
import tes from './modules/tes';

import plugins from './plugins';
import settings from '../settings';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];

const modules = {
  activities,
  auth,
  comments,
  course,
  courses,
  editor,
  editors,
  revisions,
  tes
};

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});
