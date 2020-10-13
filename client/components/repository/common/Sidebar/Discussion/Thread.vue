<template>
  <ul class="discussion-thread mt-2">
    <thread-comment
      v-for="comment in visibleItems"
      :key="comment.uid || comment.id"
      @update="onUpdate"
      @remove="item => remove(item)"
      :comment="comment" />
  </ul>
</template>

<script>
import { mapActions } from 'vuex';
import takeRight from 'lodash/takeRight';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 }
  },
  computed: {
    visibleItems() {
      return this.showAll ? this.items : takeRight(this.items, this.minDisplayed);
    }
  },
  methods: {
    ...mapActions('repository/comments', ['update', 'remove']),
    onUpdate(comment, content) {
      this.update({ ...comment, content, updatedAt: Date.now() });
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
