<template>
  <v-navigation-drawer value="true" stateless>
    <v-list class="grey--text text--darken-3 text-left">
      <v-list-item
        v-for="({ name, label, icon }) in routes"
        :key="name"
        :to="{ name }"
        active-class="black--text"
        exact
        ripple>
        <v-list-item-action class="pl-1">
          <v-icon>mdi-{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title>{{ label }}</v-list-item-title>
      </v-list-item>
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

<style lang="scss" scoped>
.v-list-item__title {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
