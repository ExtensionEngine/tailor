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
  const authRefresh = Vue.oidc.enabled
    ? Vue.oidc.slientlyRefresh().catch(() => {})
    : Promise.resolve();

  return authRefresh.then(() => store.dispatch('fetchUserInfo'));
}
