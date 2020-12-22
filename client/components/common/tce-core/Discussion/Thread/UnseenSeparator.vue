<template>
  <div class="unseen-separator">
    <v-divider />
    <v-chip
      @click="$emit('markSeen')"
      @click:close="$emit('markSeen')"
      close-icon="mdi-close"
      color="teal"
      small close outlined>
      <v-icon size="14" class="mr-1">mdi-arrow-down</v-icon>
      <span class="mr-2">{{ unseenCommentsLabel }}</span>
    </v-chip>
  </div>
</template>

<script>
import pluralize from 'pluralize';

export default {
  name: 'unseen-separator',
  props: {
    unseenCommentsCount: { type: Number, default: 0 }
  },
  computed: {
    unseenCommentsLabel: ({ unseenCommentsCount }) =>
      `${unseenCommentsCount} new ${pluralize('message', unseenCommentsCount)}`
  }
};
</script>

<style lang="scss" scoped>
.unseen-separator {
  text-align: center;

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
