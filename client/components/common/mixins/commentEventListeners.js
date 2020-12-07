import { mapActions, mapMutations } from 'vuex';
import DiscussionEvent from 'tce-core/Events/DiscussionEvent';
import { mapChannels } from '@/plugins/radio';

const { SAVE, REMOVE, SET_LAST_SEEN } = DiscussionEvent;

const COMMENT_EVENTS = [
  { event: SAVE, action: 'upsertComment' },
  { event: REMOVE, action: 'removeComment' },
  { event: SET_LAST_SEEN, action: 'setLastSeenComment' }
];

export default {
  computed: mapChannels({ editorBus: 'editor' }),
  methods: {
    ...mapActions('repository/comments', {
      saveComment: 'save',
      updateComment: 'update',
      removeComment: 'remove'
    }),
    ...mapMutations('repository/comments', ['markSeenComments']),
    upsertComment(comment) {
      const action = comment.id ? 'updateComment' : 'saveComment';
      this[action]({ ...comment, activityId: this.activityId });
    },
    setLastSeenComment({ elementUid, lastCommentAt, timeout }) {
      const payload = { elementUid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  mounted() {
    COMMENT_EVENTS.forEach(({ event, action }) => {
      this.editorBus.on(event, data => this[action](data));
    });
  }
};
