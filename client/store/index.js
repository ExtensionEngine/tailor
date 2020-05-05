import activeUsers from './modules/activeUsers';
import auth from './modules/auth';
import createLogger from 'vuex/dist/logger';
import editor from './modules/editor';
import plugins from './plugins';
import repositories from './modules/repositories';
import repository from './modules/repository';
import settings from '../settings';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];

const modules = {
  activeUsers,
  auth,
  repository,
  repositories,
  editor
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

export default new Vuex.Store({
  middlewares,
  modules,
  plugins,
  getters: {
    ...mapGetters('repositories', ['repositories', 'repositoryQueryParams']),
    ...mapGetters('activities', ['activities']),
    ...mapGetters('tes', ['tes']),
    ...mapGetters('revisions', ['revisions', 'revisionQueryParams']),
    ...mapGetters('comments', ['comments'])
  },
  strict: false
});
