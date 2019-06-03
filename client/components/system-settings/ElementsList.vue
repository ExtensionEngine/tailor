<template>
  <v-card>
    <v-card-title>
      <h1>Elements list</h1>
    </v-card-title>
    <v-list :expand="true" avatar>
      <v-list-group
        v-for="(group, name) in registry"
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
  computed: {
    registry() {
      const list = sortBy(this.$teRegistry.get(), 'position');
      const icon = 'mdi-help-rhombus';
      return list.reduce((registry, { name, type, position, ui }) => {
        const group = QUESTION_TYPES.includes(type) ? 'questions' : 'teachingElements';
        registry[group].push({ name, position, ui: { icon, ...ui } });
        return registry;
      }, { teachingElements: [], questions: [] });
    }
  },
  filters: {
    parseName(name) {
      return startCase(name);
    }
  }
};
</script>
