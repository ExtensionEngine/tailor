import Vue from 'vue';
import Vuex from 'vuex';
import VueQuillEditor from 'vue-quill-editor';
import createLogger from 'vuex/dist/logger';

import auth from './modules/auth';
import assets from './modules/assets';
import courses from './modules/courses';
import activity from './modules/activity';
import editor from './modules/editor';
import plugins from './plugins';
import settings from '../settings';

Vue.use(Vuex);
Vue.use(VueQuillEditor);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];

const modules = {
  activity,
  assets,
  auth,
  courses,
  editor
};

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});
