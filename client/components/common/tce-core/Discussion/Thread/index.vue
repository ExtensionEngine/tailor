<template>
  <ul v-intersect="onIntersect" class="discussion-thread">
    <li
      v-for="comment in visibleItems"
      :key="comment.uid"
      class="thread-item">
      <unseen-separator
        v-if="showUnseenSeparator(comment)"
        ref="unseen-separator"
        @markSeen="markActivityThreadSeen" />
      <v-divider v-else class="thread-separator" />
      <thread-comment
        @update="onUpdate"
        @remove="$emit('remove', comment)"
        v-bind="{ comment, user }"
        class="mb-3" />
      <element-link
        v-if="isActivityThread && comment.contentElement"
        v-bind="comment"
        :is-editor="isEditor"
        :element-label="elementLabel(comment)" />
    </li>
  </ul>
</template>

<script>
import ElementLink from './ElementLink';
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
    unseenActivityComments: { type: Array, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    isEditor: vm => vm.$route.name === 'editor',
    visibleItems: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed),
    unseenActivityThread: vm => orderBy(vm.unseenActivityComments, 'createdAt', 'asc'),
    firstUnseenComment: vm => vm.unseenActivityThread[0]
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    elementLabel({ contentElement: { type } }) {
      return find(this.$teRegistry._registry, { type })?.name;
    },
    showUnseenSeparator({ id, author }) {
      const { firstUnseenComment, user } = this;
      const isAuthor = user.id === author.id;
      return !isAuthor && firstUnseenComment?.id === id;
    },
    onIntersect(_entries, _observer, isIntersected) {
      if (!this.isActivityThread) return;
      this.isVisible = isIntersected;
    },
    scrollToFirstUnseen() {
      if (!this.unseenActivityThread.length) return;
      this.$nextTick(() => {
        const element = this.$refs['unseen-separator'][0].$el;
        if (!element) return;
        element.scrollIntoView();
      });
    },
    markActivityThreadSeen() {
      this.$emit('markSeen');
      this.$emit('showAll', false);
    }
  },
  watch: {
    isVisible: 'scrollToFirstUnseen',
    unseenActivityThread: {
      immediate: true,
      handler(activityComments) {
        if (activityComments.length < this.minDisplayed) return;
        this.$emit('showAll', true);
        this.scrollToFirstUnseen();
      }
    }
  },
  components: { ElementLink, ThreadComment, UnseenSeparator }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}

.discussion-thread .thread-item {
  position: relative;

  ::v-deep .unseen-separator .v-divider {
    margin: 0.75rem 0;
  }

  .thread-separator {
    margin: 0 0.25rem 0.5rem 0.25rem;
  }

  &:first-child .thread-separator {
    display: none;
  }

  ::v-deep .element-link .v-btn {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
