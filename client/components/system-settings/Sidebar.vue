<template>
  <v-navigation-drawer value="true" stateless>
    <v-list class="grey--text text--darken-3">
      <v-list-tile
        v-for="({ name, label, icon }) in routes"
        :key="name"
        :to="{ name }"
        active-class="black--text"
        exact
        ripple>
        <v-list-tile-action class="pl-1">
          <v-icon>mdi-{{ icon }}</v-icon>
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
        { label: 'System Users', name: 'system-user-management', icon: 'account' },
        { label: 'Structure Types', name: 'installed-schemas', icon: 'file-tree' },
        { label: 'Installed Elements', name: 'installed-elements', icon: 'puzzle' }
      ];
    }
  }
};
</script>
