<template>
  <div class="system-settings-container">
    <div class="heading primary elevation-2">
      <v-chip
        color="grey lighten-2"
        outlined
        class="mt-2 ml-3 px-3 body-2">
        Admin
      </v-chip>
    </div>
    <v-container>
      <v-row align="start" no-gutters class="my-4">
        <v-col class="sidebar-container">
          <sidebar />
        </v-col>
        <v-col>
          <router-view />
        </v-col>
      </v-row>
      <app-footer />
    </v-container>
  </div>
</template>

<script>
import AppFooter from '@/components/common/Footer';
import Sidebar from './Sidebar';

export default {
  components: {
    AppFooter,
    Sidebar
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

.sidebar-container {
  max-width: 19rem;
}
</style>
