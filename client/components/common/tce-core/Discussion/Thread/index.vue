<template>
  <ul v-intersect="onIntersect" class="discussion-thread">
    <li
      v-for="comment in visibleComments"
      :key="comment.uid"
      class="thread-item">
      <unseen-separator
        v-if="showUnseenSeparator(comment)"
        ref="unseen-separator"
        @seen="markSeen"
        :unseen-comments-count="unseenThread.length" />
      <v-divider v-else class="thread-separator" />
      <thread-comment
        @update="onUpdate"
        @remove="$emit('remove', comment)"
        v-bind="{ comment, user, isActivityThread, isEditor }"
        :element-label="getElementLabel(comment)"
        class="mb-3" />
    </li>
  </ul>
</template>

<script>
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import takeRgt from 'lodash/takeRight';
import ThreadComment from './Comment';
import UnseenSeparator from './UnseenSeparator';

export default {
  name: 'discussion-thread',
  inject: ['$teRegistry'],
  props: {
    items: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    isActivityThread: { type: Boolean, default: false },
    unseenComments: { type: Array, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    isEditor: vm => vm.$route.name === 'editor',
    visibleComments: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed),
    unseenThread: vm => orderBy(vm.unseenComments, 'createdAt', 'asc'),
    firstUnseenComment: vm => vm.unseenThread[0]
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    getElementLabel({ contentElement }) {
      if (!contentElement) return;
      return find(this.$teRegistry._registry, { type: contentElement.type })?.name;
    },
    showUnseenSeparator({ id, author }) {
      const { firstUnseenComment, user } = this;
      const isAuthor = user.id === author.id;
      return !isAuthor && firstUnseenComment?.id === id;
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
    },
    scrollToFirstUnseen() {
      this.$emit('showAll', true);
      this.$nextTick(() => {
        const element = this.$refs['unseen-separator'][0].$el;
        if (!element) return;
        element.scrollIntoView({ behavior: 'smooth' });
      });
    },
    markSeen() {
      this.$emit('seen');
      this.$emit('showAll', false);
    }
  },
  watch: {
    isVisible(val) {
      const { unseenThread, minDisplayed } = this;
      if (!val || !unseenThread.length) return;
      if (unseenThread.length < minDisplayed) return;
      this.scrollToFirstUnseen();
    },
    unseenThread: {
      immediate: true,
      handler(unseenComments) {
        if (unseenComments.length < this.minDisplayed) return;
        this.scrollToFirstUnseen();
      }
    }
  },
  components: { ThreadComment, UnseenSeparator }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}

.discussion-thread .thread-item {
  ::v-deep .unseen-separator .v-divider {
    margin: 1.5rem 0 0;
  }

  .thread-separator {
    margin: 0 0.25rem 0.5rem 0.25rem;
  }

  &:first-child .thread-separator {
    display: none;
  }
}
</style>
