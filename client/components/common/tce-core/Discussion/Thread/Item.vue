<template>
  <li class="thread-item">
    <div v-if="showUnseenSeparator" class="unseen-separator">
      <v-divider />
      <v-chip
        @click="$emit('seen')"
        @click:close="$emit('seen')"
        close-icon="mdi-close"
        color="teal"
        outlined small close>
        <v-icon size="14" class="mr-1">mdi-arrow-down</v-icon>
        <span class="mr-2">{{ unseenCommentsLabel }}</span>
      </v-chip>
    </div>
    <v-divider v-else class="thread-separator" />
    <thread-comment
      v-on="$listeners"
      v-bind="{ comment, user, isActivityThread, isEditor, elementLabel }"
      class="mb-3" />
  </li>
</template>

<script>
import pluralize from 'pluralize';
import ThreadComment from './Comment';

export default {
  name: 'thread-item',
  props: {
    comment: { type: Object, required: true },
    elementLabel: { type: String, default: null },
    unseenCount: { type: Number, required: true },
    isFirstUnseen: { type: Boolean, required: true },
    isActivityThread: { type: Boolean, default: false },
    user: { type: Object, required: true },
    isEditor: { type: Boolean, required: true }
  },
  computed: {
    authorId: vm => vm.comment.author.id,
    showUnseenSeparator: vm => vm.user.id !== vm.authorId && vm.isFirstUnseen,
    unseenCommentsLabel: ({ unseenCount }) =>
      `${unseenCount} new ${pluralize('message', unseenCount)}`
  },
  components: { ThreadComment }
};
</script>

<style lang="scss" scoped>
.thread-item {
  .thread-separator {
    margin: 0 0.25rem 0.5rem 0.25rem;
  }

  &:first-child .thread-separator {
    display: none;
  }
}

.thread-item .unseen-separator {
  text-align: center;

  .v-divider {
    margin: 1.5rem 0 0;
  }

  ::v-deep .v-chip.v-chip--outlined.v-chip {
    margin: -1rem 0 0.5rem 0;
    border-radius: 1rem !important;
    background-color: #fafafa !important;

    .v-chip__content .v-chip__close {
      margin-top: 0.125rem;
      font-size: 0.75rem !important;
    }
  }
}
</style>
