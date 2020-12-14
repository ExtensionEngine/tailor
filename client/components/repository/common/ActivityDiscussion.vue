<template>
  <div v-intersect="onIntersect" class="activity-discussion">
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      @setLastSeen="setLastSeenComment(1000)"
      v-bind="{ comments, user, showHeading, unseenComments, seenMarker }"
      scroll-target="editor"
      show-notifications show-all-comments />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Discussion from 'tce-core/Discussion';
import events from 'tce-core/Events/DiscussionEvent';
import get from 'lodash/get';
import { mapChannels } from '@/plugins/radio';
import orderBy from 'lodash/orderBy';

export default {
  name: 'activity-discussion',
  props: {
    activity: { type: Object, required: true },
    showHeading: { type: Boolean, default: false },
    seenMarker: { type: Boolean, default: false }
  },
  data: () => ({ isVisible: false }),
  computed: {
    ...mapChannels({ editorBus: 'editor' }),
    ...mapGetters('repository/comments', ['getComments', 'getUnseenActivityComments']),
    ...mapState({ user: state => state.auth.user }),
    comments() {
      const comments = this.getComments({ activityId: this.activity.id });
      return orderBy(comments, 'createdAt', 'desc');
    },
    unseenComments() {
      const unseenComments = this.getUnseenActivityComments(this.activity);
      return orderBy(unseenComments, 'createdAt', 'asc');
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
    setLastSeenComment(timeout = 0) {
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
    },
    onIntersect(_entries, _observer, isIntersected) {
      if (this.seenMarker) return;
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
  async created() {
    this.fetch({ activityId: this.activity.id });
    this.editorBus.on(events.SET_LAST_SEEN, () => this.setLastSeenComment());
  },
  components: { Discussion }
};
</script>

<style lang="scss" scoped>
.activity-discussion {
  position: relative;
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;
}
</style>
