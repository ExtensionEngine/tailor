<template>
  <div class="d-flex justify-end mt-3 mr-2">
    <v-tooltip open-delay="800" left>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" @click="resolveComments" color="success" x-small text>
          <v-icon color="success" size="18" class="mr-1">
            mdi-check
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
import { mapChannels } from '@/plugins/radio';

export default {
  name: 'thread-resolve',
  props: {
    comments: { type: Array, required: true }
  },
  computed: mapChannels({ editorBus: 'editor' }),
  methods: {
    resolveComments() {
      const commentIds = this.comments.map(({ id }) => id);
      this.editorBus.emit(events.RESOLVE, commentIds);
    }
  }
};
</script>
