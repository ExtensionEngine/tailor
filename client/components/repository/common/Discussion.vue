<template>
  <div class="discussion-container">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, showHeading }" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Discussion from 'tce-core/Discussion';
import get from 'lodash/get';

export default {
  name: 'discussion-wrapper',
  inject: ['$getCurrentUser'],
  props: {
    activity: { type: Object, required: true },
    contentElement: { type: Object, default: null },
    isVisible: { type: Boolean, default: false },
    showHeading: { type: Boolean, default: true }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    user: vm => vm.$getCurrentUser(),
    params: vm => ({
      activityId: vm.activity.id,
      contentElementId: vm.contentElement ? vm.contentElement.id : null
    }),
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
    setLastSeenComment(timeout) {
      const { activity, contentElement, lastCommentAt } = this;
      const uids = { activityUid: activity.uid, elementUid: contentElement?.uid };
      setTimeout(() => this.markSeenComments({ ...uids, lastCommentAt }), timeout);
    }
  },
  watch: {
    isVisible(val) {
      if (!val || !this.lastCommentAt) return;
      this.setLastSeenComment(1000);
    },
    comments(val, oldVal) {
      if (!this.isVisible || val === oldVal) return;
      this.setLastSeenComment(2000);
    }
  },
  created() {
    this.fetch(this.params);
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.discussion-container {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
