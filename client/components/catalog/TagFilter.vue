<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon text>
        <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
      </v-btn>
    </template>
    <v-sheet class="pa-4 primary darken-1">
      <v-text-field
        v-model="search"
        label="Search Tags"
        clear-icon="mdi-close-circle-outline"
        dark flat solo-inverted hide-details
        clearable />
    </v-sheet>
    <v-list v-if="filteredTags.length">
      <v-list-item
        v-for="tag in filteredTags"
        :key="tag.id"
        @click="$emit('update', tag)">
        <v-list-item-action class="mr-2">
          <v-checkbox :value="tag.isSelected" />
        </v-list-item-action>
        <v-list-item-content class="text-left">
          <v-list-item-title>{{ tag.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-else class="no-result">
      No tags found
    </div>
  </v-menu>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import { mapState } from 'vuex';

export default {
  data: () => ({ search: '' }),
  computed: {
    ...mapState('repositories', ['tags', 'tagFilter']),
    options() {
      return map(this.tags, it => {
        const isSelected = !!find(this.tagFilter, { id: it.id });
        return { ...it, isSelected };
      });
    },
    filteredTags() {
      const { options, search } = this;
      if (!search) return options;
      const reqex = new RegExp(search.trim(), 'i');
      return filter(options, ({ name }) => reqex.test(name));
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list {
  max-height: 18.75rem;
  overflow-y: auto;
  border-radius: 0 !important;
}

.no-result {
  padding: 0.75rem 0;
  background: #fff;
}
</style>
