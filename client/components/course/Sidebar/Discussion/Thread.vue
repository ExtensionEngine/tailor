<template>
  <ul class="thread">
    <thread-comment
      v-for="comment in thread"
      :key="comment._cid || comment.id"
      @update="onUpdate"
      @remove="onRemove"
      :comment="comment"
      :avatar="avatars"
      class="clearfix comment" />
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import orderBy from 'lodash/orderBy';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    sort: { type: String, default: 'desc' },
    showMore: { type: Boolean, default: false },
    avatars: { type: Boolean, default: true },
    minDisplayed: { type: Number, required: true }
  },
  computed: {
    ...mapGetters(['comments']),
    displayedComments() {
      if (this.showMore) return this.comments;
      return this.comments.slice(0, this.minDisplayed);
    },
    thread() {
      return orderBy(this.displayedComments, ['createdAt'], [this.sort]);
    }
  },
  methods: {
    ...mapActions('comments', ['update', 'remove']),
    onUpdate(comment, content) {
      const updatedAt = Date.now();
      this.update(Object.assign({}, comment, { content, updatedAt }));
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
