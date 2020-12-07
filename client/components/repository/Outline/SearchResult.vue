<template>
  <v-hover v-slot="{ hover }">
    <v-card
      @click="$emit('select')"
      :class="{ 'lighten-4': isSelected || hover }"
      :ripple="false"
      elevation="0"
      rounded="0"
      class="my-5 py-1 blue-grey lighten-5 text-left">
      <v-card-subtitle class="pb-1 d-flex align-center">
        <v-chip
          :color="color"
          label small dark
          class="readonly mr-2 body-2">
          {{ typeLabel }}
        </v-chip>
        <v-chip
          color="blue-grey darken-2"
          label small dark
          class="readonly px-4 subtitle-2">
          {{ activity.shortId }}
        </v-chip>
      </v-card-subtitle>
      <v-card-title class="py-1 headline text-truncate">
        {{ activity.data.name }}
      </v-card-title>
      <v-card-actions class="py-1">
        <v-btn @mousedown.stop="$emit('show')" text>
          Go to
          <v-icon small class="pl-1">mdi-arrow-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import find from 'lodash/find';
import { mapGetters } from 'vuex';

export default {
  name: 'activity-search-result',
  props: {
    activity: { type: Object, required: true },
    isSelected: { type: Boolean, default: false }
  },
  computed: {
    ...mapGetters('repository', ['structure']),
    config: vm => find(vm.structure, { type: vm.activity.type }),
    color: vm => vm.config.color,
    typeLabel: vm => vm.config.label
  }
};
</script>

<style lang="scss" scoped>
.v-card {
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.v-card--link:focus {
  background: #fafafa;

  &::before {
    display: none;
  }
}
</style>
