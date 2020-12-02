import { mapActions, mapGetters, mapMutations } from 'vuex';
import { ContainedContent } from 'tce-core';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';

const COMMENT_EVENTS = [
  { event: 'comment:save', action: 'upsertComment' },
  { event: 'comment:remove', action: 'deleteComment' },
  { event: 'comment:set-last-seen', action: 'setLastSeenComment' }
];

const extractParams = ({ activity, element }) => ({
  activityId: activity.id,
  contentElementId: element.id
});

export default {
  computed: {
    ...mapChannels({ editorChannel: 'editor' }),
    ...mapGetters('editor', ['activity']),
    ...mapGetters('repository/comments', ['getUnseenElementComments', 'getComments']),
    params: vm => extractParams(vm),
    comments: vm => vm.getComments(vm.params),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime(),
    elementBus: vm => vm.$radio.channel(`element:${vm.element.id}`),
    unseenComments() {
      const { id: activityId, uid: activityUid } = this.activity;
      const element = { ...this.element, activityUid, activityId };
      return this.getUnseenElementComments(element);
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
    async upsertComment(comment) {
      const action = comment.id ? 'updateComment' : 'saveComment';
      await this[action]({ ...comment, ...this.params });
      return this.emitCommentsData();
    },
    async deleteComment(comment) {
      await this.removeComment(comment);
      return this.emitCommentsData();
    },
    emitCommentsData() {
      const { comments, unseenComments, lastCommentAt } = this;
      const data = { comments, unseenComments, lastCommentAt };
      this.elementBus.emit('comments:init', data);
    },
    setLastSeenComment(timeout) {
      const { element, lastCommentAt } = this;
      const payload = { elementUid: element.uid, lastCommentAt };
      setTimeout(() => {
        this.markSeenComments(payload);
        this.emitCommentsData();
      }, timeout);
    }
  },
  watch: {
    unseenComments: 'emitCommentsData'
  },
  async created() {
    await this.fetchComments(this.params);
    this.emitCommentsData();
    COMMENT_EVENTS.forEach(({ event, action }) => {
      this.elementBus.on(event, data => this[action](data));
    });
  },
  provide() {
    return { $elementBus: this.elementBus };
  },
  components: { ContainedContent }
};
