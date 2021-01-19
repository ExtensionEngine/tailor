<template>
  <div class="resolve-button">
    <v-tooltip open-delay="800" left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-on="on"
          @click="resolve"
          color="teal accent-4"
          small text
          class="px-1">
          <v-icon size="24" color="teal accent-4" class="mr-2">
            mdi-check-circle-outline
          </v-icon>
          Resolve Discussion
        </v-btn>
      </template>
      <span>Mark discussion as resolved</span>
    </v-tooltip>
  </div>
</template>

<script>
import events from '../Events/DiscussionEvent';

export default {
  name: 'resolve-button',
  inject: ['$editorBus'],
  props: {
    comments: { type: Array, required: true }
  },
  methods: {
    resolve() {
      const { contentElementId } = this.comments[0];
      this.$editorBus.emit(events.RESOLVE, contentElementId);
    }
  }
};
</script>
