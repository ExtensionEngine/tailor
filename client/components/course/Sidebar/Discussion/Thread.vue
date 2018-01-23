<template>
  <ul class="thread">
    <thread-comment
      v-for="comment in thread"
      :key="comment._cid || comment.id"
      :comment="comment"
      :avatar="avatars"
      @update="onUpdate"
      @remove="onRemove"
      class="clearfix comment">
    </thread-comment>
  </ul>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import orderBy from 'lodash/orderBy';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    avatars: { type: Boolean, default: true },
    sort: { type: String, default: 'desc' }
  },
  computed: {
    ...mapGetters(['comments']),
    thread() {
      return orderBy(this.comments, ['createdAt'], [this.sort]);
    }
  },
  methods: {
    ...mapActions(['update', 'remove'], 'comments'),
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
