import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments'
];

export default new VuexPersistence({
  key: 'TAILOR_APP_STATE',
  reducer: state => ({
    auth: state.auth,
    repository: {
      comments: {
        seenByActivity: state.repository.comments.seen.activity,
        seen: migrateSeenState(state)
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
