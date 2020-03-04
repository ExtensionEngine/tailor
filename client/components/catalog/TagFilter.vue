<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon text>
        <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="it in options"
        :key="it.id"
        @click="$emit('update', it)">
        <v-list-item-action class="mr-2">
          <v-checkbox :value="it.isSelected" />
        </v-list-item-action>
        <v-list-item-content class="text-left">
          <v-list-item-title>{{ it.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import find from 'lodash/find';
import map from 'lodash/map';
import { mapState } from 'vuex';

export default {
  computed: {
    ...mapState('repositories', ['tags', 'tagFilter']),
    options() {
      return map(this.tags, it => {
        const isSelected = !!find(this.tagFilter, { id: it.id });
        return { ...it, isSelected };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  max-height: 18.75rem;
  overflow-y: auto;
  padding: 1rem 0;
}

</style>
