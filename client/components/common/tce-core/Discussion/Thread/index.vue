<template>
  <div v-intersect="onIntersect">
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ isActivityThread, user, comments: visibleComments.seen }" />
    <unseen-divider
      v-show="unseenCount"
      ref="unseenDivider"
      @seen="markSeen"
      :unseen-count="unseenCount" />
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ isActivityThread, user, comments: visibleComments.unseen }" />
  </div>
</template>

<script>
import takeRgt from 'lodash/takeRight';
import ThreadList from './List';
import transform from 'lodash/transform';
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
      return transform(comments, (acc, comment) => {
        const key = comment.unseen ? 'unseen' : 'seen';
        return acc[key].push(comment);
      }, { seen: [], unseen: [] });
    }
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
    },
    revealUnseen(unseenCount) {
      const { $refs, minDisplayed } = this;
      if ((unseenCount || this.unseenCount) < minDisplayed) return;
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
