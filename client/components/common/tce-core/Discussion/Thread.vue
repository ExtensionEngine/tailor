<template>
  <ul class="discussion-thread">
    <thread-comment
      v-for="comment in visibleSeenItems"
      :key="comment.uid"
      @update="onUpdate"
      @remove="$emit('remove', comment)"
      v-bind="{ comment, user, showAllComments }" />
    <div v-if="showUnseenSeparator" class="unseen-separator">
      <v-divider class="my-3" />
      <v-chip @click="showSeenMarker = !showSeenMarker" small outlined>
        Unseen
      </v-chip>
      <div class="d-flex justify-center">
        <transition name="slide-fade">
          <v-btn
            v-if="showSeenMarker"
            @click="$emit('markSeen')"
            color="teal"
            text x-small
            class="seen-marker">
            <v-icon class="mr-1" x-small>mdi-check</v-icon>
            Mark All as Seen
          </v-btn>
        </transition>
      </div>
      <thread-comment
        v-for="comment in visibleUnseenItems"
        :key="comment.uid"
        @update="onUpdate"
        @remove="$emit('remove', comment)"
        v-bind="{ comment, user, showAllComments }" />
    </div>
  </ul>
</template>

<script>
import find from 'lodash/find';
import takeRgt from 'lodash/takeRight';
import ThreadComment from './Comment';

export default {
  name: 'discussion-thread',
  props: {
    items: { type: Array, required: true },
    user: { type: Object, required: true },
    showAll: { type: Boolean, default: false },
    minDisplayed: { type: Number, default: 5 },
    showAllComments: { type: Boolean, default: false },
    unseenComments: { type: Array, default: () => [] },
    seenMarker: { type: Boolean, default: false }
  },
  data: () => ({ showSeenMarker: false }),
  computed: {
    visibleSeenItems() {
      const { items, unseenComments, showAll, minDisplayed } = this;
      if (!unseenComments.length) return items;
      const seenItems = items.filter(({ id }) => !find(unseenComments, { id }));
      return showAll ? seenItems : takeRgt(seenItems, minDisplayed);
    },
    visibleUnseenItems() {
      const { unseenComments, showAll, minDisplayed } = this;
      return showAll ? unseenComments : takeRgt(unseenComments, minDisplayed);
    },
    showUnseenSeparator() {
      const { seenMarker, unseenComments, isAuthor } = this;
      return seenMarker && !isAuthor && unseenComments.length;
    }
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

  .unseen-separator {
    text-align: center;

    ::v-deep .v-chip.v-chip--outlined.theme--light {
      margin-top: -3rem;
      border-radius: 0.75rem !important;
      background-color: #fff !important;
    }

    .seen-marker {
      margin-top: -0.875rem;
      margin-bottom: 0.5rem;
    }

    .slide-fade-enter, .slide-fade-leave-to {
      transform: translateX(0.625rem);
      opacity: 0;
    }
  }
}
</style>
