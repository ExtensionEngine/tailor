import auth from './modules/auth/index.js';
import createLogger from 'vuex/dist/logger.js';
import editor from './modules/editor/index.js';
import plugins from './plugins/index.js';
import repositories from './modules/repositories/index.js';
import repository from './modules/repository/index.js';
import settings from '../settings.js';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const isDevEnv = process.env.NODE_ENV !== 'production';
const middlewares = settings.debug.state && isDevEnv ? [createLogger()] : [];

const modules = {
  auth,
  repository,
  repositories,
  editor
};

const store = new Vuex.Store({
  middlewares,
  modules,
  plugins,
  strict: false
});

export default function getStore() {
  return hydrateUserStore().then(() => store);
}

function hydrateUserStore() {
  const authRefresh = Vue.oidc.enabled && Vue.oidc.logoutEnabled
    ? Vue.oidc.slientlyRefresh().catch(() => {})
    : Promise.resolve();

  return authRefresh.then(() => store.dispatch('fetchUserInfo'));
}
