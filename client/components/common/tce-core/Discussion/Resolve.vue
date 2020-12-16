<template>
  <div class="d-flex justify-end mt-3 mr-2">
    <v-tooltip open-delay="800" left>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" @click="resolveComments" color="teal" x-small text>
          <v-icon color="teal" size="16" class="mr-1">mdi-check</v-icon>
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
  name: 'thread-resolve',
  inject: ['$editorBus'],
  props: {
    comments: { type: Array, required: true }
  },
  methods: {
    resolveComments() {
      const { contentElementId } = this.comments[0];
      this.$editorBus.emit(events.RESOLVE, contentElementId);
    }
  }
};
</script>
