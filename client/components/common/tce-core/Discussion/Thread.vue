<template>
  <ul class="discussion-thread">
    <thread-comment
      v-for="comment in visibleItems"
      :key="comment.uid"
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ comment, user, showAllComments }" />
  </ul>
</template>

<script>
import takeRgt from 'lodash/takeRight';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true },
    user: { type: Object, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    showAllComments: { type: Boolean, default: false }
  },
  computed: {
    visibleItems: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed)
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    }
  },
  components: { ThreadComment }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
