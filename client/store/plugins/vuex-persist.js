import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments'
];

const STORAGE_KEY = 'TAILOR_APP_STATE';
migrateSeenState();

export default new VuexPersistence({
  key: STORAGE_KEY,
  reducer: ({ auth, repository }) => ({
    auth,
    repository: {
      comments: {
        seenByActivity: repository.comments.seen.activity,
        seen: repository.comments.seen
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;

function migrateSeenState() {
  const storage = window.localStorage;
  const state = JSON.parse(storage.getItem(STORAGE_KEY));
  const { seenByActivity, seen } = state.repository.comments;
  if (seenByActivity) state.repository.comments = { seen: seenByActivity };
  if (seen) state.repository.comments = { seenByActivity: seen };
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
