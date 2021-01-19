<template>
  <div v-intersect="onIntersect" class="discussion-thread">
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ isActivityThread, user, comments: visibleComments.seen }" />
    <unseen-divider
      v-show="unseenThread.length"
      ref="unseenDivider"
      @seen="markSeen"
      :unseen-count="unseenThread.length" />
    <thread-list
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ isActivityThread, user, comments: visibleComments.unseen }" />
  </div>
</template>

<script>
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
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
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    visibleComments() {
      const { items, minDisplayed, showAll } = this;
      const comments = showAll ? items : takeRgt(items, minDisplayed);
      return transform(comments, (acc, it) => {
        const key = it.unseen ? 'unseen' : 'seen';
        return acc[key].push(it);
      }, { seen: [], unseen: [] });
    },
    unseenThread: vm => orderBy(filter(vm.items, 'unseen'), 'createdAt', 'asc')
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
    },
    revealUnseen(unseenComments) {
      const { $refs, unseenThread, minDisplayed } = this;
      const unseen = unseenComments || unseenThread;
      if (unseen.length < minDisplayed) return;
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
      if (!val || !this.unseenThread.length) return;
      this.revealUnseen();
    },
    unseenThread: {
      immediate: true,
      handler: 'revealUnseen'
    }
  },
  components: { UnseenDivider, ThreadList }
};
</script>

<style lang="scss" scoped>
.discussion-thread ::v-deep .thread-list {
  margin: 0;

  .thread-list-item {
    .v-divider {
      margin: 0 0.25rem 1rem 0.25rem;
    }

    &:first-child .v-divider {
      display: none;
    }
  }
}
</style>
