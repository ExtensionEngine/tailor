import VuexPersistence from 'vuex-persist';

const STORAGE_KEY = 'TAILOR_USER';

export default new VuexPersistence({
  // The key to store the state on in the storage provider.
  key: STORAGE_KEY,
  // Only save auth module.
  modules: ['auth'],
  // Use localStorage
  storage: window.localStorage
}).plugin;
