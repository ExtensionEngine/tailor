<template>
  <span>
    <v-menu :close-on-content-click="false" offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" icon text class="my-1">
          <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
        </v-btn>
      </template>
      <v-list class="py-0">
        <v-list-item
          v-for="it in items"
          :key="it.id"
          @click="$emit('update', it)"
          class="py-0 secondary--text text--lighten-1">
          <v-checkbox
            v-model="it.isSelected"
            :label="it.name" />
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
import map from 'lodash/map';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('repositories', ['tags', 'tagFilter']),
    items() {
      return map(this.tags, it => {
        const isSelected = map(this.tagFilter, 'id').includes(it.id);
        return { ...it, isSelected };
      });
    }
  }
};
</script>
