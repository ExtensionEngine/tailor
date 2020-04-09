<template>
  <div class="system-settings-container">
    <v-toolbar height="48" absolute class="heading blue-grey darken-3 elevation-2">
      <v-toolbar-title>
        <v-chip color="secondary lighten-1" small class="px-3 body-2">
          Admin
        </v-chip>
      </v-toolbar-title>
    </v-toolbar>
    <v-container>
      <v-row align="start">
        <v-col cols="3">
          <admin-sidebar />
        </v-col>
        <v-col cols="9">
          <router-view />
        </v-col>
      </v-row>
      <app-footer />
    </v-container>
  </div>
</template>

<script>
import AdminSidebar from './Sidebar';
import AppFooter from '@/components/common/Footer';

export default {
  components: {
    AdminSidebar,
    AppFooter
  }
};
</script>

<style lang="scss" scoped>
.system-settings-container {
  width: 100%;
  height: 100%;
  padding: 3.125rem 0 3.75rem;
}

.heading {
  width: 100%;
  text-transform: uppercase;
  z-index: 2;
}
</style>
