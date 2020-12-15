<template>
  <ul class="discussion-thread">
    <div v-for="(comment, index) in visibleItems" :key="comment.uid">
      <thread-separator
        @markSeen="$emit('markSeen')"
        v-bind="{ comment, unseenComments, seenMarker, index, user }" />
      <thread-comment
        @update="onUpdate"
        @remove="$emit('remove', comment)"
        v-bind="{ comment, containAllComments, user }" />
    </div>
  </ul>
</template>

<script>
import takeRgt from 'lodash/takeRight';
import ThreadComment from './Comment';
import ThreadSeparator from './Separator';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true },
    user: { type: Object, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    containAllComments: { type: Boolean, default: false },
    unseenComments: { type: Array, default: () => [] },
    seenMarker: { type: Boolean, default: false }
  },
  computed: {
    visibleItems: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed)
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    }
  },
  components: { ThreadSeparator, ThreadComment }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
