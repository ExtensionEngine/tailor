<template>
  <div v-intersect="onIntersect" class="discussion-thread">
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', $event)"
      v-bind="{ isActivityThread, user, comments: visibleComments.seen }" />
    <transition name="fade">
      <unseen-divider
        v-if="unseenCount"
        ref="unseenDivider"
        @seen="markSeen"
        :count="unseenCount" />
    </transition>
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', $event)"
      v-bind="{ isActivityThread, user, comments: visibleComments.unseen }" />
  </div>
</template>

<script>
import partition from 'lodash/partition';
import takeRgt from 'lodash/takeRight';
import ThreadList from './List';
import UnseenDivider from './UnseenDivider';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    isActivityThread: { type: Boolean, default: false },
    unseenCount: { type: Number, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    visibleComments() {
      const { items, minDisplayed, showAll } = this;
      const comments = showAll ? items : takeRgt(items, minDisplayed);
      const [unseen, seen] = partition(comments, 'unseen');
      return { seen, unseen };
    }
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, editedAt: Date.now() });
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
    },
    revealUnseen(count) {
      const { $refs, minDisplayed } = this;
      if ((count || this.unseenCount) < minDisplayed) return;
      this.$emit('showAll', true);
      this.$nextTick(() => {
        const element = $refs.unseenDivider.$el;
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
      if (!val || !this.unseenCount) return;
      this.revealUnseen();
    },
    unseenCount: {
      immediate: true,
      handler: 'revealUnseen'
    }
  },
  components: { UnseenDivider, ThreadList }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  max-height: 31.25rem;
  overflow-y: scroll;
  overflow-x: hidden;

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
}
</style>
