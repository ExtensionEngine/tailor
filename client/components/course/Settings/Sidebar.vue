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
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Actions</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile
          v-for="({ label, name, icon, color }) in actions"
          :key="name"
          @click="$emit('action', name)"
          :color="color ? color : 'blue-grey darken-3'"
          ripple>
          <v-list-tile-action class="pl-1">
            <v-icon :color="color ? color : 'primary'">
              mdi-{{ icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{ label }}</v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  computed: {
    routes() {
      return [
        { label: 'General', name: 'course-info', icon: 'mdi-wrench' },
        { label: 'People', name: 'user-management', icon: 'mdi-account' }
      ];
    },
    actions() {
      return [
        { label: 'Knewton inventory', icon: 'download', name: 'knewton' },
        { label: 'Clone', icon: 'content-copy', name: 'clone' },
        { label: 'Publish', icon: 'upload', name: 'publish' },
        { label: 'Delete', icon: 'delete', name: 'delete', color: 'error' }
      ];
    }
  }
};
</script>

<style lang="scss" scoped>
.v-list__group::after {
  background: none !important;
}
</style>
