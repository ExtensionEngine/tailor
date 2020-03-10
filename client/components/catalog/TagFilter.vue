<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" icon text>
        <v-icon color="primary lighten-4">mdi-tag-outline</v-icon>
      </v-btn>
    </template>
    <v-list>
      <div>
        <v-text-field
          v-model="search"
          :hide-details="true"
          prepend-inner-icon="mdi-magnify"
          placeholder="Search..."
          solo />
      </div>
      <div class="item-container">
        <v-list-item
          v-for="it in filteredTags"
          :key="it.id"
          @click="$emit('update', it)">
          <v-list-item-action class="mr-2">
            <v-checkbox v-model="it.isSelected" />
          </v-list-item-action>
          <v-list-item-content class="text-left">
            <v-list-item-title>{{ it.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-menu>
</template>

<script>
import find from 'lodash/find';
import map from 'lodash/map';
import { mapState } from 'vuex';

export default {
  data() {
    return { search: '' };
  },
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
      return search
        ? options.filter(it => it.name.toLowerCase().includes(search.toLowerCase()))
        : options;
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
