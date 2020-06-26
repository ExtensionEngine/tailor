<template>
  <v-toolbar color="transparent" flat dense>
    <v-text-field
      @input="$emit('search', $event)"
      @click:clear="$emit('search', '')"
      :value="search"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search by name or id..."
      hide-details clearable />
    <v-spacer />
    <v-btn
      v-if="!isFlat"
      @click="toggleActivities"
      :disabled="!!search"
      color="grey darken-4"
      text>
      Toggle all
    </v-btn>
  </v-toolbar>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'repository-structure-toolbar',
  props: {
    search: { type: String, default: '' },
    isFlat: { type: Boolean, default: false }
  },
  methods: mapActions('repository', ['toggleActivities'])
};
</script>
