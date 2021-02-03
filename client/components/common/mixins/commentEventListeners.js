import { mapActions, mapMutations } from 'vuex';
import DiscussionEvent from 'tce-core/Events/DiscussionEvent';
import { mapChannels } from '@/plugins/radio';

const { SAVE, REMOVE, SET_LAST_SEEN, RESOLVE } = DiscussionEvent;

const COMMENT_EVENTS = [
  { event: SAVE, action: 'upsertComment' },
  { event: REMOVE, action: 'removeComment' },
  { event: SET_LAST_SEEN, action: 'setLastSeenComment' },
  { event: RESOLVE, action: 'resolveComments' }
];

export default {
  computed: mapChannels({ editorBus: 'editor' }),
  methods: {
    ...mapActions('repository/comments', {
      fetchComments: 'fetch',
      saveComment: 'save',
      updateComment: 'update',
      removeComment: 'remove',
      resolveComments: 'updateResolvement'
    }),
    ...mapMutations('repository/comments', ['markSeenComments']),
    async upsertComment({ hasUnresolvedComments, ...comment }) {
      const { id, contentElementId: elementId } = comment;
      const action = id ? 'updateComment' : 'saveComment';
      await this[action]({ ...comment, activityId: this.activityId });
      if (!hasUnresolvedComments) this.fetchComments({ elementId });
    },
    setLastSeenComment({ timeout = 200, ...payload }) {
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  created() {
    COMMENT_EVENTS.forEach(({ event, action }) => {
      this.editorBus.on(event, this[action]);
    });
  }
};
