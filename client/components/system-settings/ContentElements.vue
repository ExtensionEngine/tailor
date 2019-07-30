<template>
  <v-card class="element-list-container">
    <v-text-field
      v-model.trim="search"
      label="Search"
      append-icon="mdi-magnify"
      clearable />
    <v-list :expand="true" avatar two-line>
      <v-list-group
        v-for="(group, groupName) in filteredRegistry"
        :key="groupName"
        value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ groupName | parseName }}</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile
          v-for="({ name, ui, version, position }) in group"
          :key="position"
          ripple>
          <v-list-tile-avatar>
            <v-icon large>{{ ui.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="name" />
            <v-list-tile-sub-title>Version {{ version }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';

const QUESTION_TYPES = ['ASSESSMENT', 'QUESTION'];

export default {
  inject: ['$teRegistry'],
  data() {
    return { search: '' };
  },
  computed: {
    registry() {
      const list = sortBy(this.$teRegistry.get(), 'position');
      const icon = 'mdi-help-rhombus';
      return list.reduce((registry, { type, ui, ...item }) => {
        const searchable = item.name.toLowerCase();
        const group = QUESTION_TYPES.includes(type) ? 'questions' : 'contentElements';
        registry[group].push({ searchable, ...item, ui: { icon, ...ui } });
        return registry;
      }, { contentElements: [], questions: [] });
    },
    filteredRegistry() {
      let { registry, search } = this;
      if (!search) return registry;
      search = search.toLowerCase();
      const cond = ({ searchable }) => searchable.includes(search);
      const contentElements = registry.contentElements.filter(cond);
      const questions = registry.questions.filter(cond);
      return { contentElements, questions };
    }
  },
  filters: {
    parseName(name) {
      return startCase(name);
    }
  }
};
</script>

<style lang="scss" scoped>
.element-list-container {
  padding: 30px;
}

.theme--light.v-list {
  .v-list__group--active::before, .v-list__group--active::after {
    background: none;
  }
}
</style>
