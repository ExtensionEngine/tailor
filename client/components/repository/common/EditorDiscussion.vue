<template>
  <div class="editor-discussion">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, hasAllComments, showHeading }" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import Discussion from 'tce-core/Discussion';
import get from 'lodash/get';

export default {
  name: 'editor-discussion',
  inject: ['$getCurrentUser'],
  props: {
    activity: { type: Object, required: true },
    isVisible: { type: Boolean, default: false },
    hasAllComments: { type: Boolean, default: false },
    showHeading: { type: Boolean, default: true }
  },
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    user: vm => vm.$getCurrentUser(),
    comments: vm => vm.getComments({ activityId: vm.activity.id }),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    ...mapMutations('repository/comments', ['markSeenComments']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { activity, user: author } = this;
      return this[action]({ ...comment, activityId: activity.id, author });
    },
    setLastSeenComment(timeout) {
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
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
    this.fetch({ activityId: this.activity.id });
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.editor-discussion {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
