import VuexPersistence from 'vuex-persist';

export default new VuexPersistence({
  key: process.env.VUEX_STORAGE_KEY,
  reducer: state => ({
    auth: state.auth,
    repository: {
      comments: {
        seenByActivity: state.repository.comments.seenByActivity
      }
    }
  }),
  storage: window.localStorage
}).plugin;
