<template>
  <ul class="discussion-thread mt-2">
    <thread-comment
      v-for="comment in comments"
      :key="comment._cid || comment.id"
      @update="onUpdate"
      @remove="item => remove(item)"
      :comment="comment" />
    <infinite-loading @infinite="infiniteHandler">
      <div slot="spinner" class="spinner">
        <v-progress-circular color="primary" indeterminate />
      </div>
      <span slot="no-results">No comments!</span>
      <span slot="no-more">No more comments.</span>
    </infinite-loading>
  </ul>
</template>

<script>
import dropRight from 'lodash/dropRight';
import InfiniteLoading from 'vue-infinite-loading';
import { mapActions } from 'vuex';
import takeRight from 'lodash/takeRight';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true }
  },
  data: () => ({ comments: [], currentIndex: 6, step: 6 }),
  methods: {
    ...mapActions('repository/comments', ['update', 'remove']),
    onUpdate(comment, content) {
      this.update({ ...comment, content, updatedAt: Date.now() });
    },
    infiniteHandler($state) {
      setTimeout(() => {
        if (this.step < this.items.length) {
          const temp = dropRight(this.items, this.step);
          this.comments = this.comments.concat(takeRight(temp, this.currentIndex));
          this.step += this.currentIndex;
          $state.loaded();
        } else {
          $state.complete();
        }
      }, 1000);
    }
  },
  watch: {
    items(val, oldVal) {
      if (val.length === oldVal.length) return;
      this.comments = takeRight(this.items, this.step);
    }
  },
  created() {
    if (this.items.length) {
      this.comments = takeRight(this.items, this.step);
    }
  },
  components: { InfiniteLoading, ThreadComment }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  max-height: 31.25rem;
  overflow-y: scroll;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
