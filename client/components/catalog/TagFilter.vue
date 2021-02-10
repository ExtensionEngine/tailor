<template>
  <v-menu
    ref="filter"
    @update:return-value="search = ''"
    :close-on-content-click="false"
    offset-y>
    <template v-slot:activator="{ on: menu, value }">
      <v-tooltip
        :disabled="value"
        open-delay="800"
        top>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn v-on="{ ...menu, ...tooltip }" color="primary lighten-2" icon>
            <v-icon>mdi-tag-outline</v-icon>
          </v-btn>
        </template>
        <span>Tags</span>
      </v-tooltip>
    </template>
    <v-sheet
      tile
      class="pa-3 primary darken-4">
      <v-text-field
        v-model="search"
        label="Filter tags..."
        flat hide-details solo clearable />
    </v-sheet>
    <v-list v-if="filteredTags.length" :key="isVisible">
      <v-list-item
        v-for="tag in filteredTags"
        :key="tag.id"
        @click="$emit('update', tag)">
        <v-list-item-action class="mr-2">
          <v-checkbox :input-value="tag.isSelected" />
        </v-list-item-action>
        <v-list-item-content class="text-left">
          <v-list-item-title>{{ tag.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-else class="white py-3">
      No tags found
    </div>
  </v-menu>
</template>

<script>
import filter from 'lodash/filter';
import find from 'lodash/find';
import get from 'lodash/get';
import map from 'lodash/map';
import { mapState } from 'vuex';
import orderBy from 'lodash/orderBy';

export default {
  data: () => ({ search: '' }),
  computed: {
    ...mapState('repositories', ['tags', 'tagFilter']),
    isVisible: vm => get(vm.$refs.filter, 'isActive', false),
    options: ({ tags, tagFilter }) => {
      const options = map(tags, it => {
        const isSelected = !!find(tagFilter, { id: it.id });
        return { ...it, isSelected };
      });
      return orderBy(options, [tag => tag.name.toLowerCase()], ['asc']);
    },
    filteredTags: ({ options, search }) => {
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
  border-radius: 0;
  overflow-y: auto;
}
</style>
