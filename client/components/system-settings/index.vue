<template>
  <div class="system-settings-container white">
    <div class="heading primary elevation-5">
      <v-chip
        color="grey lighten-2"
        label
        outlined
        class="mt-2 ml-3 px-3 body-2">
        Admin
      </v-chip>
    </div>
    <v-container>
      <v-row align="start" no-gutters class="my-4">
        <v-card>
          <sidebar />
        </v-card>
        <v-col class="ml-6">
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
  padding: 50px 0 60px;
}

.heading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 46px;
  color: #444;
  text-align: left;
  text-transform: uppercase;
  z-index: 2;
}
</style>
