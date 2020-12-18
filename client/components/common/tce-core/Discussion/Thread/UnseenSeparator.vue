<template>
  <div class="unseen-separator">
    <v-divider />
    <v-btn @click="showSeenConfirmation = !showSeenConfirmation" x-small rounded>
      Unseen
    </v-btn>
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
</template>

<script>
export default {
  name: 'unseen-separator',
  data: () => ({ showSeenConfirmation: false })
};
</script>

<style lang="scss" scoped>
.unseen-separator {
  display: flex;
  align-items: center;
  flex-direction: column;

  .v-divider {
    width: 100%;
    margin: 0.75rem 0;
  }

  .v-btn--rounded {
    width: 4.5rem;
    margin: -1.375rem 0 0.5rem 0;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.12);
  }

  .seen-confirmation {
    margin-bottom: 0.5rem;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(0.625rem);
    opacity: 0;
  }
}
</style>
