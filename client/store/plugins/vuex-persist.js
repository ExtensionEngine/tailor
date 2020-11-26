import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'repository/comments/markSeenComments'
];

export default new VuexPersistence({
  key: 'TAILOR_APP_STATE',
  reducer: state => ({
    repository: {
      comments: {
        seenByActivity: state.repository.comments.seenByActivity
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;
