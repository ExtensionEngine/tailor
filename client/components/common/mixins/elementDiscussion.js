
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { getCommentEvents as events } from 'tce-core/utils';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';
import transform from 'lodash/transform';

const COMMENT_EVENTS = [
  { event: events().SAVE, action: 'upsertComment' },
  { event: events().REMOVE, action: 'deleteComment' },
  { event: events().SET_LAST_SEEN, action: 'setLastSeenComment' }
];

export default {
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    ...mapState('repository/contentElements', { elements: 'items' }),
    ...mapGetters('repository/comments', ['getUnseenElementComments', 'getComments']),
    commentsWithinElements() {
      const { id: activityId, uid: activityUid } = this.activity;
      return transform(this.elements, (acc, it) => {
        const element = { ...it, activityUid, activityId };
        const comments = this.getComments({ activityId, contentElementId: it.id });
        const lastCommentAt = new Date(get(comments[0], 'createdAt', 0)).getTime();
        const unseenComments = this.getUnseenElementComments(element);
        acc[it.uid] = { ...it, comments, lastCommentAt, unseenComments };
      }, {});
    }
  },
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
    deleteComment(comment) {
      this.removeComment(comment);
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
