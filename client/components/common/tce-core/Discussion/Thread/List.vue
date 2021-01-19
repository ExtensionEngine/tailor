<template>
  <ul class="thread-list">
    <li v-for="comment in comments" :key="comment.uid" class="thread-list-item">
      <v-divider />
      <thread-comment
        v-on="$listeners"
        v-bind="{ comment, isActivityThread, user }"
        :element-label="getElementLabel(comment)"
        class="mb-3" />
    </li>
  </ul>
</template>

<script>
import find from 'lodash/find';
import ThreadComment from './Comment';

export default {
  name: 'thread-list',
  inject: ['$teRegistry'],
  props: {
    comments: { type: Array, default: () => [] },
    isActivityThread: { type: Boolean, default: false },
    elementLabel: { type: String, default: null },
    user: { type: Object, required: true }
  },
  methods: {
    getElementLabel({ contentElement }) {
      if (!contentElement) return;
      return find(this.$teRegistry._registry, { type: contentElement.type })?.name;
    }
  },
  components: { ThreadComment }
};
</script>

<style lang="scss" scoped>
.thread-list {
  margin: 0;
  padding: 0;
  list-style: none;

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
