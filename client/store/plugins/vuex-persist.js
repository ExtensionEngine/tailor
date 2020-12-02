import VuexPersistence from 'vuex-persist';

const OBSERVED_MUTATIONS = [
  'login',
  'logout',
  'setUser',
  'repository/comments/markSeenComments'
];

export default new VuexPersistence({
  key: 'TAILOR_APP_STATE',
  reducer: ({ auth, repository }) => ({
    auth,
    repository: {
      comments: {
        seenByActivity: repository.comments.seen.activity,
        seen: migrateSeenState(repository)
      }
    }
  }),
  storage: window.localStorage,
  filter: mutation => OBSERVED_MUTATIONS.includes(mutation.type)
}).plugin;

function migrateSeenState(repository) {
  const storage = window.localStorage.getItem('TAILOR_APP_STATE');
  const { seenByActivity } = JSON.parse(storage).repository.comments;
  const { seen } = repository.comments;
  const activity = { ...seenByActivity, ...seen.activity };
  return { activity, contentElement: seen.contentElement };
}
