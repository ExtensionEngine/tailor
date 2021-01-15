<template>
  <ul v-intersect="onIntersect" class="discussion-thread">
    <thread-item
      v-for="comment in visibleComments"
      :key="comment.uid"
      ref="threadItem"
      @seen="markSeen"
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      :comment="comment"
      :element-label="getElementLabel(comment)"
      :is-first-unseen="firstUnseen.id === comment.id"
      :is-activity-thread="isActivityThread"
      :user="user" />
  </ul>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import takeRgt from 'lodash/takeRight';
import ThreadItem from './Item';

export default {
  name: 'discussion-thread',
  inject: ['$teRegistry'],
  props: {
    items: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    isActivityThread: { type: Boolean, default: false },
    user: { type: Object, required: true }
  },
  data: () => ({ isVisible: false }),
  computed: {
    visibleComments: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed),
    unseenThread: vm => orderBy(filter(vm.items, 'isUnseen'), 'createdAt', 'asc'),
    firstUnseen() {
      const firstUnseenIndex = this.items.findIndex(it => it.isUnseen);
      return { id: this.items[firstUnseenIndex]?.id, index: firstUnseenIndex };
    }
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    getElementLabel({ contentElement }) {
      if (!contentElement) return;
      return find(this.$teRegistry._registry, { type: contentElement.type })?.name;
    },
    onIntersect(_entries, _observer, isIntersected) {
      this.isVisible = isIntersected;
    },
    revealUnseen(unseenComments) {
      const { $refs, unseenThread, minDisplayed, firstUnseen } = this;
      const unseen = unseenComments || unseenThread;
      if (unseen.length < minDisplayed) return;
      this.$emit('showAll', true);
      this.$nextTick(() => {
        const element = $refs.threadItem[firstUnseen.index].$el;
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
  components: { ThreadItem }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
