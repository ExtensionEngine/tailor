<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon text>
        <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-text-field
        v-model="search"
        :hide-details="true"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search..."
        solo />
      <div class="item-container">
        <v-list-item
          v-for="tag in filteredTags"
          :key="tag.id"
          @click="$emit('update', tag)">
          <v-list-item-action class="mr-2">
            <v-checkbox v-model="tag.isSelected" />
          </v-list-item-action>
          <v-list-item-content class="text-left">
            <v-list-item-title>{{ tag.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
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
.item-container {
  max-height: 18.75rem;
  overflow-y: auto;
}
</style>
