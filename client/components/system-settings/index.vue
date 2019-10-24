<template>
  <div class="system-settings-container white">
    <div class="heading primary elevation-5">
      <v-chip
        color="grey lighten-2"
        label
        outline
        class="mt-2 ml-3 px-3 body-2">
        Admin
      </v-chip>
    </div>
    <v-container>
      <v-layout row align-start>
        <v-card>
          <sidebar />
        </v-card>
        <v-flex ml-4>
          <router-view />
        </v-flex>
      </v-layout>
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
