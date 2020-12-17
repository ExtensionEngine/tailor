<template>
  <div class="unseen-separator">
    <v-divider class="my-3" />
    <v-chip @click="showSeenConfirmation = !showSeenConfirmation" small outlined>
      Unseen
    </v-chip>
    <div class="d-flex justify-center">
      <transition name="slide-fade">
        <v-btn
          v-if="showSeenConfirmation"
          @click="$emit('markSeen')"
          color="teal"
          text x-small
          class="seen-confirmation">
          <v-icon size="16" class="mr-1">mdi-check</v-icon>
          Mark All as Seen
        </v-btn>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'unseen-separator',
  data: () => ({ showSeenConfirmation: false })
};
</script>

<style lang="scss" scoped>
.unseen-separator {
  text-align: center;

  ::v-deep .v-chip.v-chip--outlined.theme--light {
    margin-top: -3rem;
    border-radius: 0.75rem !important;
    background-color: #fff !important;
  }

  .seen-confirmation {
    margin-top: -0.875rem;
    margin-bottom: 0.5rem;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(0.625rem);
    opacity: 0;
  }
}
</style>
