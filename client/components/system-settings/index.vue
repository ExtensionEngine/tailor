<template>
  <div class="system-settings-container">
    <v-toolbar
      height="42"
      absolute
      color="primary darken-3"
      class="heading elevation-2">
      <v-chip
        color="primary lighten-3"
        text-color="black"
        small
        class="ml-1 px-8 body-2 readonly">
        Admin
      </v-chip>
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
import AdminSidebar from './Sidebar.vue';
import AppFooter from '@/components/common/Footer.vue';

export default {
  components: { AdminSidebar, AppFooter }
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
