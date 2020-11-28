import { mapActions, mapGetters, mapMutations } from 'vuex';
import get from 'lodash/get';

const extractParams = ({ activity, contentElement }) => ({
  activityId: activity.id,
  contentElementId: contentElement ? contentElement.id : null
});

export default {
  inject: ['$getCurrentUser'],
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    user: vm => vm.$getCurrentUser(),
    params: vm => extractParams(vm),
    comments: vm => vm.getComments(vm.params),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    ...mapMutations('repository/comments', ['markSeenComments']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { user: author, params } = this;
      return this[action]({ ...comment, ...params, author });
    },
    setLastSeenComment(timeout, unseenCEComments) {
      const { activity, contentElement, lastCommentAt } = this;
      const payload = {
        activityUid: activity.uid,
        ceUid: contentElement?.uid,
        unseenCEComments,
        lastCommentAt
      };
      setTimeout(() => this.markSeenComments(payload), timeout);
    }
  },
  created() {
    this.fetch(this.params);
  }
};
