<template>
  <ul class="thread mt-2">
    <thread-comment
      v-for="comment in visibleItems"
      :key="comment._cid || comment.id"
      @update="onUpdate"
      @remove="onRemove"
      :comment="comment" />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import orderBy from 'lodash/orderBy';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    sortOrder: { type: String, default: 'desc' },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 4 }
  },
  computed: {
    ...mapGetters(['comments']),
    thread: v => orderBy(v.comments, ['createdAt'], [v.sortOrder]),
    visibleItems: v => v.showAll ? v.comments : v.comments.slice(0, v.minDisplayed)
  },
  methods: {
    ...mapActions('comments', ['update', 'remove']),
    onUpdate(comment, content) {
      this.update({ ...comment, content, updatedAt: Date.now() });
    },
    onRemove(comment) {
      this.remove(comment);
    }
  },
  components: { ThreadComment }
};
</script>

<style lang="scss" scoped>
.thread {
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
