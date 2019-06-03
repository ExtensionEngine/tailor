<template>
  <v-card>
    <v-card-title>
      <h1>Schemas list</h1>
    </v-card-title>
    <v-list>
      <v-list-tile
        v-for="{ id, name } in schemas"
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
  computed: {
    schemas() {
      return SCHEMAS;
    }
  }
};
</script>
