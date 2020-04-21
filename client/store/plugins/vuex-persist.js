import VuexPersistence from 'vuex-persist';

const MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments'
];

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
  storage: window.localStorage,
  filter: mutation => MUTATIONS.includes(mutation.type)
}).plugin;
