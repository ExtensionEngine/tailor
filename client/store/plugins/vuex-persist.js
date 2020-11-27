import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments',
  'repository/comments/fetch'
];

export default new VuexPersistence({
  key: 'TAILOR_APP_STATE',
  reducer: state => ({
    auth: state.auth,
    repository: {
      comments: {
        seenByActivity: state.repository.comments.seen.activity,
        seen: {
          ...state.repository.comments.seen,
          activity: migrateActivitySeen(state)
        }
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;

function migrateActivitySeen(state) {
  const { seen, seenByActivity } = state.repository.comments;
  return { ...seenByActivity, ...seen.activity };
}
