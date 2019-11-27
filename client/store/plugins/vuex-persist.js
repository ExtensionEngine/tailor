import VuexPersistence from 'vuex-persist';

const MODULES_TO_PERSIST = ['auth'];

export default new VuexPersistence({
  // The key to store the state on in the storage provider.
  key: process.env.PERSIST_STORAGE_KEY,
  modules: MODULES_TO_PERSIST,
  // Use localStorage
  storage: window.localStorage
}).plugin;
