import VuexPersistence from 'vuex-persist';

export default new VuexPersistence({
  // The key to store the state in the storage provider.
  key: process.env.VUEX_STORAGE_KEY,
  modules: ['auth'],
  // Use localStorage
  storage: window.localStorage
}).plugin;
