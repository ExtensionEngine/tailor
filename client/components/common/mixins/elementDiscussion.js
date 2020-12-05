
import { mapActions, mapMutations } from 'vuex';
import discussionEvent from 'tce-core/Events/discussionEvent';
import { mapChannels } from '@/plugins/radio';

const { SAVE, REMOVE, SET_LAST_SEEN } = discussionEvent;

const COMMENT_EVENTS = [
  { event: SAVE, action: 'upsertComment' },
  { event: REMOVE, action: 'removeComment' },
  { event: SET_LAST_SEEN, action: 'setLastSeenComment' }
];

export default {
  computed: mapChannels({ editorBus: 'editor' }),
  methods: {
    ...mapActions('repository/comments', {
      fetchComments: 'fetch',
      saveComment: 'save',
      updateComment: 'update',
      removeComment: 'remove'
    }),
    ...mapMutations('repository/comments', ['markSeenComments']),
    upsertComment(comment) {
      const action = comment.id ? 'updateComment' : 'saveComment';
      this[action]({ ...comment, activityId: this.activity.id });
    },
    setLastSeenComment({ timeout, elementUid, lastCommentAt }) {
      const payload = { elementUid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  async mounted() {
    await this.fetchComments({ activityId: this.activity.id });
    COMMENT_EVENTS.forEach(({ event, action }) => {
      this.editorBus.on(event, data => this[action](data));
    });
  }
};
