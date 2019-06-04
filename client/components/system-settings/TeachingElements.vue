<template>
  <v-card class="elements-list-container">
    <v-text-field v-model.trim="search" label="Search" clearable/>
    <v-list :expand="true" avatar>
      <v-list-group
        v-for="(group, name) in filteredRegistry"
        :key="name"
        value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ name | parseName }}</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile
          v-for="({ name, ui, position }) in group"
          :key="position"
          ripple>
          <v-list-tile-avatar>
            <v-icon>{{ ui.icon }}</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-text="name"/>
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
      return list.reduce((registry, { name, type, position, ui }) => {
        const group = QUESTION_TYPES.includes(type) ? 'questions' : 'teachingElements';
        registry[group].push({ name, position, ui: { icon, ...ui } });
        return registry;
      }, { teachingElements: [], questions: [] });
    },
    filteredRegistry() {
      let { registry, search } = this;
      if (!search) return registry;
      search = search.toLowerCase();
      const cond = ({ name }) => name.toLowerCase().includes(search);
      const teachingElements = registry.teachingElements.filter(cond);
      const questions = registry.questions.filter(cond);
      return { teachingElements, questions };
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
.elements-list-container {
  padding: 30px;
}
</style>
