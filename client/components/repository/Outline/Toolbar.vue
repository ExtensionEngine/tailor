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
    <v-btn @click="toggleGraphView" :input-value="isGraphView" icon>
      <v-icon>mdi-graph-outline</v-icon>
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
    isGraphView: vm => vm.$route.query.graph
  },
  methods: {
    ...mapActions('repository', ['toggleActivities']),
    toggleGraphView() {
      const { graph, ...query } = this.$route.query;
      if (this.isGraphView) return this.$router.push({ query });
      this.$router.push({ query: { ...query, graph: true } });
    }
  }
};
</script>
