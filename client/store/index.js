import activities from './modules/activities';
import auth from './modules/auth';
import comments from './modules/comments';
import course from './modules/course';
import courses from './modules/courses';
import createLogger from 'vuex/dist/logger';
import editor from './modules/editor';
import plugins from './plugins/';
import request from '../api/request';
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

const mapGetters = (namespace, getters) => {
  return getters.reduce((acc, name) => {
    const path = [namespace, name].join('/');
    return Object.assign(acc, {
      [name](_, getters) {
        return getters[path];
      }
    });
  }, {});
};

const store = new Vuex.Store({
  middlewares,
  modules,
  plugins,
  getters: {
    ...mapGetters('courses', ['courses', 'courseQueryParams']),
    ...mapGetters('activities', ['activities']),
    ...mapGetters('tes', ['tes']),
    ...mapGetters('revisions', ['revisions', 'revisionQueryParams']),
    ...mapGetters('comments', ['comments'])
  },
  strict: false
});

request.setStorageInterface({
  getToken: () => store.getters.token,
  clearAuthData: () => store.dispatch('logout')
});

export default store;
