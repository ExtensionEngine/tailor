<template>
  <v-card class="schemas-list-container">
    <v-text-field v-model.trim="search" label="Search" clearable/>
    <v-list>
      <v-list-tile
        v-for="{ id, name } in filteredSchemas"
        :key="id">
        <v-list-tile-content>
          <v-list-tile-title v-text="name"/>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-card>
</template>

<script>
import { SCHEMAS } from 'shared/activities';

export default {
  data() {
    return { search: '' };
  },
  computed: {
    schemas() {
      return SCHEMAS;
    },
    filteredSchemas() {
      let { schemas, search } = this;
      if (!search) return schemas;
      search = search.toLowerCase();
      return schemas.filter(({ name }) => name.toLowerCase().includes(search));
    }
  }
};
</script>

<style lang="scss" scoped>
.schemas-list-container {
  padding: 30px;
}
</style>
