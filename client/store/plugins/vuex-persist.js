import isEmpty from 'lodash/isEmpty';
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
  if (!state) return;
  const { seenByActivity } = state.repository.comments;
  if (!isEmpty(seenByActivity)) {
    state.repository.comments.seen = { activity: seenByActivity };
  }
  if (seenByActivity) delete state.repository.comments.seenByActivity;
  storage.setItem(STORAGE_KEY, JSON.stringify(state));
}
