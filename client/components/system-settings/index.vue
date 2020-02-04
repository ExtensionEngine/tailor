<template>
  <div class="system-settings-container">
    <div class="heading primary elevation-1">
      <v-chip
        color="grey lighten-2"
        outlined
        class="mt-2 ml-3 px-3 body-2">
        Admin
      </v-chip>
    </div>
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
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 2.875rem;
  text-align: left;
  text-transform: uppercase;
  z-index: 2;
}
</style>
