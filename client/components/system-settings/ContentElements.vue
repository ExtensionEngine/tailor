<template>
  <div class="element-list-container">
    <v-text-field
      v-model.trim="search"
      label="Search"
      append-icon="mdi-magnify"
      outlined clearable
      class="mx-2" />
    <v-list :expand="true" avatar two-line class="grey lighten-4 text-left">
      <v-list-group
        v-for="(group, groupName) in filteredRegistry"
        :key="groupName"
        value="true">
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-title>{{ groupName | parseName }}</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="({ name, ui, version, position }) in group"
          :key="position"
          ripple>
          <v-list-item-avatar>
            <v-icon large>{{ ui.icon }}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="name" />
            <v-list-item-subtitle>Version {{ version }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>

<script>
import startCase from 'lodash/startCase';

const QUESTION_TYPES = ['ASSESSMENT', 'QUESTION'];

export default {
  inject: ['$teRegistry'],
  data() {
    return { search: '' };
  },
  computed: {
    registry() {
      const icon = 'mdi-help-rhombus';
      return this.$teRegistry.all.reduce((registry, { type, ui, ...item }) => {
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
  padding: 1.875rem;
}

.theme--light.v-list {
  .v-list__group--active::before, .v-list__group--active::after {
    background: none;
  }
}
</style>
