<template>
  <div class="separator-container">
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
    </div>
    <v-divider v-else-if="!isFirstComment" class="mt-0 mb-2 mx-1" />
  </div>
</template>

<script>
export default {
  name: 'discussion-thread',
  props: {
    comment: { type: Object, required: true },
    unseenComments: { type: Array, default: () => [] },
    seenMarker: { type: Boolean, default: false },
    isFirstComment: { type: Boolean, required: true },
    user: { type: Object, required: true }
  },
  data: () => ({ showSeenMarker: false }),
  computed: {
    isAuthor: vm => vm.user.id === vm.comment.author.id,
    showUnseenSeparator() {
      const { comment, seenMarker, unseenComments, isAuthor } = this;
      return seenMarker && !isAuthor && unseenComments[0]?.id === comment.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.separator-container .unseen-separator {
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
</style>
