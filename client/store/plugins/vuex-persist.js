import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments'
];

export default new VuexPersistence({
  key: process.env.VUE_APP_VUEX_STORAGE_KEY,
  reducer: state => ({
    auth: state.auth,
    repository: {
      comments: {
        seenByActivity: state.repository.comments.seenByActivity
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;
