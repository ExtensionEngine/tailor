<template>
  <v-navigation-drawer value="true" stateless>
    <v-list class="grey--text text--darken-2 text-left">
      <v-list-item
        v-for="({ name, label, icon }) in routes"
        :key="name"
        :to="{ name }"
        active-class="grey--text text--darken-3"
        exact
        ripple>
        <v-list-item-action class="pl-1">
          <v-icon>{{ icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-title>{{ label }}</v-list-item-title>
      </v-list-item>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-item class="pl-0">
            <v-list-item-title>Actions</v-list-item-title>
          </v-list-item>
        </template>
        <v-list-item
          v-for="({ label, name, icon, color }) in actions"
          :key="name"
          @click="$emit('action', name)"
          :color="color ? color : 'blue-grey darken-3'"
          ripple>
          <v-list-item-action class="pl-1">
            <v-icon :color="color ? color : 'primary'">
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
      return [
        { label: 'General', name: 'course-info', icon: 'mdi-wrench' },
        { label: 'People', name: 'user-management', icon: 'mdi-account' }
      ];
    },
    actions() {
      return [
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

.v-list-item__title {
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
