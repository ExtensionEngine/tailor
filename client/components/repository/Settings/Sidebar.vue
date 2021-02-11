<template>
  <v-navigation-drawer
    :value="true"
    stateless
    class="transparent">
    <v-list class="primary--text text--darken-4 text-left">
      <v-list-item
        v-for="({ name, label, icon, query }) in routes"
        :key="name"
        :to="{ name, query }"
        active-class="primary lighten-5"
        exact ripple>
        <v-list-item-action>
          <v-icon color="primary darken-3">mdi-{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title>{{ label }}</v-list-item-title>
      </v-list-item>
      <v-list-group :value="true">
        <template v-slot:activator>
          <v-list-item class="pl-0">
            <v-list-item-title>Actions</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="({ label, name, icon, color }) in actions"
          :key="name"
          @click="$emit('action', name)"
          :color="color ? color : 'primary darken-3'"
          ripple>
          <v-list-item-action class="pl-1">
            <v-icon :color="color ? color : 'primary darken-2'">
              mdi-{{ icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>{{ label }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    routes() {
      const { query } = this.$route;
      return [
        { label: 'General', name: 'repository-info', icon: 'wrench' },
        { label: 'People', name: 'user-management', icon: 'account' }
      ].map(route => ({ ...route, query }));
    },
    actions() {
      return [
        { label: 'Clone', icon: 'content-copy', name: 'clone' },
        { label: 'Publish', icon: 'upload', name: 'publish' },
        { label: 'Export', icon: 'export', name: 'export' },
        { label: 'Delete', icon: 'delete', name: 'delete', color: 'error' }
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

.v-list__group::after {
  background: none !important;
}

.v-list-item__title {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
