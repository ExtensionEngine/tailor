import activities from './modules/activities';
import auth from './modules/auth';
import comments from './modules/comments';
import course from './modules/course';
import courses from './modules/courses';
import createLogger from 'vuex/dist/logger';
import editor from './modules/editor';
import plugins from './plugins';
import revisions from './modules/revisions';
import settings from '../settings';
import tes from './modules/tes';

import Vue from 'vue';
import Vuex from 'vuex';

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
  revisions,
  tes
};

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});
