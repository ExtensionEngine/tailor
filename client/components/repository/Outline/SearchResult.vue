<template>
  <v-card @click="$emit('select')" class="my-3 py-1 text-left">
    <v-card-subtitle class="pb-1">
      <v-chip :color="color" label x-small class="pa-2 mr-1" />
      {{ typeLabel }}
    </v-card-subtitle>
    <v-card-title class="py-0 text-truncate">
      {{ activity.data.name }}
    </v-card-title>
    <v-card-actions class="py-1">
      <v-btn @mousedown.stop="$emit('show')" text>
        Go to
        <v-icon small class="pl-1">mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  name: 'activity-search-result',
  props: {
    activity: { type: Object, required: true }
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    config: vm => find(vm.structure, { type: vm.activity.type }),
    color: vm => vm.config.color,
    typeLabel: vm => vm.config.label
  }
};
</script>
