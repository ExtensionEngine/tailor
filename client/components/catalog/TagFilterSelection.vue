<template>
  <v-row class="selected-tags align-center">
    <v-chip
      v-for="tag in tagFilter"
      :key="tag.id"
      @click:close="$emit('close', tag)"
      close
      class="mx-2">
      {{ tag.name }}
    </v-chip>
    <v-btn
      v-if="tagFilter.length"
      @click="$emit('clear:all')" small rounded>
      Clear all
    </v-btn>
  </v-row>
</template>

<script>
import { mapState } from 'vuex';

export default {
  computed: mapState('repositories', ['tagFilter'])
};
</script>

<style lang="scss" scoped>
.selected-tags {
  min-height: 2.5rem;
}

.v-chip {
  height: 1.75rem !important;
}
</style>
