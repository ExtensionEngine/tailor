import VuexPersistence from 'vuex-persist';

const STORAGE_KEY = process.env.VUEX_PERSIST_STORAGE_KEY;
const MODULES_TO_PERSIST = ['auth'];

export default new VuexPersistence({
  // The key to store the state on in the storage provider.
  key: STORAGE_KEY,
  modules: MODULES_TO_PERSIST,
  // Use localStorage
  storage: window.localStorage
}).plugin;
