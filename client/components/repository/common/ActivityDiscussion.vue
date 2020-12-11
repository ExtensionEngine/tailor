<template>
  <div v-intersect="onIntersect" class="activity-discussion">
    <transition name="slide-fade">
      <v-btn
        v-if="showSeenMarker"
        @click="setLastSeenComment"
        color="secondary"
        text x-small
        class="seen-marker">
        <v-icon class="mr-1" x-small>mdi-check</v-icon>
        Mark All as Seen
      </v-btn>
    </transition>
    <discussion
      @save="saveComment"
      @update="saveComment"
      @remove="remove"
      @mark-seen="setLastSeenComment"
      v-bind="{ comments, user, showHeading, scrollTarget: 'editor' }"
      show-notifications show-all-comments />
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
  data: () => ({ isVisible: false, showSeenMarker: false }),
  computed: {
    ...mapGetters('repository/comments', ['getComments', 'getUnseenActivityComments']),
    ...mapState({ user: state => state.auth.user }),
    comments() {
      const comments = this.getComments({ activityId: this.activity.id });
      return orderBy(comments, 'createdAt', 'desc');
    },
    unseenComments: vm => vm.getUnseenActivityComments(vm.activity),
    lastCommentAt: vm => new Date(get(vm.comments[0], 'createdAt', 0)).getTime()
  },
  methods: {
    ...mapActions('repository/comments', ['fetch', 'save', 'update', 'remove']),
    ...mapMutations('repository/comments', ['markSeenComments']),
    async saveComment(comment) {
      const action = comment.id ? 'update' : 'save';
      const { activity, user: author } = this;
      await this[action]({ ...comment, author, activityId: activity.id });
      setTimeout(() => Object.assign(this, {
        isVisible: true,
        showSeenMarker: false
      }), 2500);
    },
    setLastSeenComment(timeout = 0) {
      const { activity, lastCommentAt } = this;
      const payload = { activityUid: activity.uid, lastCommentAt };
      setTimeout(() => this.markSeenComments(payload), timeout);
      this.showSeenMarker = false;
    },
    onIntersect(_entries, _observer, isIntersected) {
      if (this.showHeading) return;
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
    },
    unseenComments: {
      immediate: true,
      handler(comments) {
        if (!this.showHeading || !comments.length) return;
        setTimeout(() => (this.showSeenMarker = true), 2000);
      }
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
  position: relative;
  margin: 1rem 0 1.75rem;
  padding: 0.375rem 1rem;
  border: 1px solid #bbb;

  .seen-marker {
    position: absolute;
    top: 1.5625rem;
    right: 8.5rem;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(0.625rem);
    opacity: 0;
  }
}
</style>
