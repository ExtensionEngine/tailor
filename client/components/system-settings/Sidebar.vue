<template>
  <v-navigation-drawer :value="true" color="transparent" stateless>
    <v-list class="text-left">
      <v-list-item
        v-for="({ name, label, icon }) in routes"
        :key="name"
        :to="{ name }"
        color="blue-grey darken-4"
        exact ripple>
        <v-list-item-action class="pl-1">
          <v-icon color="blue-grey darken-3">mdi-{{ icon }}</v-icon>
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
.v-navigation-drawer {
  ::v-deep .v-navigation-drawer__border {
    display: none;
  }
}

.v-list-item__title {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
