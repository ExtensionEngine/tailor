<template>
  <v-navigation-drawer value="true" stateless>
    <v-list class="grey--text text--darken-2">
      <v-list-tile
        v-for="({ name, label, icon }) in routes"
        :key="name"
        :to="{ name }"
        active-class="grey--text text--darken-3"
        exact
        ripple>
        <v-list-tile-action class="pl-1">
          <v-icon>{{ icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>{{ label }}</v-list-tile-title>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    routes() {
      return [
        { label: 'Users', name: 'system-user-management', icon: 'mdi-account' },
        { label: 'Schemas list', name: 'system-schemas-list', icon: 'mdi-sitemap' },
        { label: 'Elements list', name: 'system-elements-list', icon: 'mdi-book-open-variant' }
      ];
    }
  }
};
</script>

<style>

</style>
