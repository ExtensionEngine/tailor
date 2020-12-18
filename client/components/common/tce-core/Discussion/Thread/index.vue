<template>
  <ul class="discussion-thread">
    <li
      v-for="comment in visibleItems"
      :key="comment.uid"
      class="thread-item">
      <unseen-separator
        v-if="showUnseenSeparator(comment)"
        @markSeen="$emit('markSeen')" />
      <v-divider v-else class="thread-separator" />
      <thread-comment
        @update="onUpdate"
        @remove="$emit('remove', comment)"
        v-bind="{ comment, user }"
        class="mb-3" />
      <element-link
        v-if="isActivityThread && comment.contentElement"
        v-bind="comment"
        :is-editor="isEditor"
        :element-label="elementLabel(comment)" />
    </li>
  </ul>
</template>

<script>
import ElementLink from './ElementLink';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import takeRgt from 'lodash/takeRight';
import ThreadComment from './Comment';
import UnseenSeparator from './UnseenSeparator';

export default {
  name: 'discussion-thread',
  inject: ['$teRegistry'],
  props: {
    items: { type: Array, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    lastSeen: { type: Number, required: true },
    isActivityThread: { type: Boolean, default: false },
    seenConfirmation: { type: Boolean, default: false },
    user: { type: Object, required: true },
    activityId: { type: Number, default: null }
  },
  computed: {
    isEditor: vm => vm.$route.name === 'editor',
    visibleItems: vm => vm.showAll ? vm.items : takeRgt(vm.items, vm.minDisplayed),
    unseenActivityComments() {
      const { items, user, lastSeen, activityId } = this;
      if (!activityId) return [];
      const unseenComments = items.filter(it => {
        const createdAt = new Date(it.createdAt).getTime();
        const isAuthor = it.authorId === user.id;
        return it.activityId === activityId && !isAuthor && createdAt > lastSeen;
      });
      return orderBy(unseenComments, 'createdAt', 'asc');
    },
    firstUnseenComment: vm => vm.unseenActivityComments[0]
  },
  methods: {
    onUpdate(comment, content) {
      this.$emit('update', { ...comment, content, updatedAt: Date.now() });
    },
    showUnseenSeparator({ id, author }) {
      const { seenConfirmation, firstUnseenComment, user } = this;
      const isAuthor = user.id === author.id;
      return seenConfirmation && !isAuthor && firstUnseenComment?.id === id;
    },
    elementLabel({ contentElement: { type } }) {
      return find(this.$teRegistry._registry, { type })?.name;
    }
  },
  components: { ElementLink, ThreadComment, UnseenSeparator }
};
</script>

<style lang="scss" scoped>
.discussion-thread {
  margin: 0;
  padding: 0;
  list-style: none;
}

.discussion-thread .thread-item {
  position: relative;

  ::v-deep .unseen-separator .v-divider {
    margin: 0.75rem 0;
  }

  .thread-separator {
    margin: 0 0.25rem 0.5rem 0.25rem;
  }

  &:first-child .thread-separator {
    display: none;
  }

  ::v-deep .element-link .v-btn {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
