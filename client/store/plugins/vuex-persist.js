import VuexPersistence from 'vuex-persist';

export default new VuexPersistence({
  key: process.env.VUEX_STORAGE_KEY,
  modules: ['auth'],
  storage: window.localStorage
}).plugin;
