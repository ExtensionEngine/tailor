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
        seen: migrateSeenState(state),
        seenElementComments: state.repository.comments.seenElementComments,
        seenByActivity: state.repository.comments.seen.activity
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;

function migrateSeenState(state) {
  const { seen, seenByActivity } = state.repository.comments;
  const activity = { ...seenByActivity, ...seen.activity };
  return { activity, contentElement: seen.contentElement };
}
