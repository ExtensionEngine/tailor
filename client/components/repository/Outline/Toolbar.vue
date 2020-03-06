<template>
  <v-toolbar color="transparent" flat dense>
    <v-text-field
      @input="$emit('search', $event)"
      @click:clear="$emit('search', '')"
      :value="search"
      prepend-inner-icon="mdi-magnify"
      placeholder="Search by name..."
      hide-details clearable />
    <v-spacer />
    <span class="mr-1">
      <v-icon v-for="it in view" :key="it.icon" :color="it.color" class="pr-1">
        mdi-{{ it.icon }}
      </v-icon>
    </span>
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
  computed: {
    view: vm => ([
      { icon: 'file-tree', color: !vm.search ? 'primary' : 'grey lighten-1' },
      { icon: 'view-list', color: vm.search ? 'primary' : 'grey lighten-1' }
    ])
  },
  methods: mapActions('repository', ['toggleActivities'])
};
</script>
