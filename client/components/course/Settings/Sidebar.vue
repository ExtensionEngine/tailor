<template>
  <v-navigation-drawer
    stateless
    value="true">
    <v-list>
      <v-list-tile
        @click="routeTo('course-info')"
        ripple>
        <v-list-tile-action>
          <v-icon>mdi-wrench</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>General</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
        @click="routeTo('user-management')"
        ripple>
        <v-list-tile-action>
          <v-icon>mdi-account</v-icon>
        </v-list-tile-action>
        <v-list-tile-title>User management</v-list-tile-title>
      </v-list-tile>
      <v-list-group value="true">
        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>Actions</v-list-tile-title>
          </v-list-tile>
        </template>
        <v-list-tile
          @click="$emit('actionClick', 'knewton')"
          color="blue-grey darken-3"
          ripple>
          <v-list-tile-action>
            <v-icon>mdi-download</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Knewton inventory</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          @click="$emit('actionClick', 'clone')"
          color="blue-grey darken-3"
          ripple>
          <v-list-tile-action>
            <v-icon>mdi-content-copy</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Clone repository</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          v-if="!isPublishing"
          @click="$emit('actionClick', 'publish')"
          color="blue-grey darken-3"
          ripple>
          <v-list-tile-action>
            <v-icon>mdi-upload</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Publish content</v-list-tile-title>
        </v-list-tile>
        <v-list-tile
          v-else
          class="publishing-progress">
          <v-progress-circular
            color="blue-grey darken-3"
            indeterminate/>
        </v-list-tile>
        <v-list-tile
          @click.stop="$emit('actionClick', 'delete')"
          color="error"
          ripple>
          <v-list-tile-action>
            <v-icon color="error">mdi-delete</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Delete repository</v-list-tile-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  props: {
    isPublishing: { type: Boolean, default: false }
  },
  methods: {
    routeTo(name) {
      this.$router.push({ name });
    }
  }
};
</script>

<style lang="scss" scoped>
.publishing-progress {
  display: flex;
  justify-content: center;
}
</style>
