<template>
  <div class="system-settings-container white">
    <div class="heading primary elevation-5">
      <v-chip
        color="primary lighten-4"
        label
        class="body-2 mt-2 ml-3">
        <v-icon color="secondary lighten-1" class="pr-1">
          mdi-shield-account-outline
        </v-icon>
        Admin
      </v-chip>
    </div>
    <v-container>
      <v-layout row align-start>
        <v-card>
          <sidebar/>
        </v-card>
        <v-flex ml-4>
          <router-view/>
        </v-flex>
      </v-layout>
      <app-footer/>
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
  text-align: left;
  text-transform: uppercase;
  color: #444;
  z-index: 2;
}
</style>
