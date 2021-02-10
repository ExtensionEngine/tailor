<template>
  <v-toolbar color="transparent" flat dense>
    <v-text-field
      v-if="!isGraphView"
      @input="$emit('search', $event)"
      @click:clear="$emit('search', '')"
      :value="search"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search by name or id..."
      hide-details clearable />
    <v-spacer />
    <v-btn
      v-if="!isFlat && !isGraphView"
      @click="toggleActivities"
      :disabled="!!search"
      color="grey darken-4"
      text>
      Toggle all
    </v-btn>
    <v-tooltip v-if="!isFlat" open-delay="800" bottom>
      <template #activator="{ on }">
        <v-btn
          v-on="on"
          @click="$emit('toggle:graph')"
          :input-value="isGraphView"
          icon>
          <v-icon>mdi-graph-outline</v-icon>
        </v-btn>
      </template>
      View graph
    </v-tooltip>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'repository-structure-toolbar',
  props: {
    search: { type: String, default: '' },
    isFlat: { type: Boolean, default: false },
    isGraphView: { type: Boolean, default: false }
  },
  methods: mapActions('repository', ['toggleActivities'])
};
</script>
