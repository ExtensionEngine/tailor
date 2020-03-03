<template>
  <v-row class="selected-tags align-center">
    <v-btn
      v-if="tagFilter.length"
      @click="clearTagFilter" small rounded>
      Clear all
    </v-btn>
    <v-chip
      v-for="tag in tagFilter"
      :key="tag.id"
      @click:close="toggleTagFilter(tag)"
      close
      class="ma-2">
      {{ tag.name }}
    </v-chip>
  </v-row>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
export default {
  computed: {
    ...mapState('repositories', ['tagFilter'])
  },
  methods: {
    ...mapMutations('repositories', ['clearTagFilter', 'toggleTagFilter'])
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  max-height: 18.75rem;
  padding: 1rem;
  overflow-y: scroll;
}

</style>
