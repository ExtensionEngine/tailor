<template>
  <div v-intersect="onIntersect" class="activity-discussion">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      v-bind="{ comments, user, showHeading, scrollTarget: 'editor' }"
      show-notifications />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Discussion from 'tce-core/Discussion';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export default {
  name: 'activity-discussion',
  props: {
    activity: { type: Object, required: true },
    showHeading: { type: Boolean, default: false }
  },
  data: () => ({ isVisible: false }),
  computed: {
    ...mapGetters('repository/comments', ['getComments']),
    ...mapState({ user: state => state.auth.user }),
    comments() {
      const params = { activityId: this.activity.id, contentElementId: null };
      return orderBy(this.getComments(params), 'createdAt', 'desc');
    },
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    ...mapMutations('repository/comments', ['markSeenComments']),
    saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { activity, user: author } = this;
      return this[action]({ ...comment, author, activityId: activity.id });
    },
    setLastSeenComment(timeout) {
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
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
.activity-discussion {
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
