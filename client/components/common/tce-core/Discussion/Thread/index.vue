<template>
  <ul v-intersect="onIntersect" class="discussion-thread">
    <thread-item
      v-for="(comment, index) in visibleComments"
      :key="comment.uid"
      ref="threadItem"
      @seen="markSeen"
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ comment, isActivityThread, user, isEditor }"
      :element-label="getElementLabel(comment)"
      :unseen-count="unseenThread.length"
      :is-first-unseen="firstUnseenIndex === index" />
  </ul>
</template>

<script>
import filter from 'lodash/filter';
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
    isEditor: vm => vm.$route.name === 'editor',
    visibleComments: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed),
    unseenThread: vm => orderBy(filter(vm.items, 'unseen'), 'createdAt', 'asc'),
    firstUnseenIndex: vm => vm.items.findIndex(it => it.unseen)
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
    toggleUnseen(unseenComments) {
      const { $refs, unseenThread, minDisplayed, firstUnseenIndex } = this;
      const unseen = unseenComments || unseenThread;
      if (unseen.length < minDisplayed) return;
      this.$emit('showAll', true);
      this.$nextTick(() => {
        const element = $refs.threadItem[firstUnseenIndex].$el;
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
      this.toggleUnseen();
    },
    unseenThread: {
      immediate: true,
      handler: 'toggleUnseen'
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
