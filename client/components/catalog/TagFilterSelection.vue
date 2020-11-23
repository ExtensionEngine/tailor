<template>
  <v-row class="selected-tags align-center">
    <custom-chip
      v-for="tag in tagFilter"
      :key="tag.id"
      @click:close="$emit('close', tag)"
      close
      color="grey lighten-4"
      class="mx-2">
      {{ tag.name }}
    </custom-chip>
    <v-btn
      v-if="tagFilter.length"
      @click="$emit('clear:all')" small rounded>
      Clear all
    </v-btn>
  </v-row>
</template>

<script>
import CustomChip from '@/components/common/Chip';
import { mapState } from 'vuex';

export default {
  computed: mapState('repositories', ['tagFilter']),
  components: { CustomChip }
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
