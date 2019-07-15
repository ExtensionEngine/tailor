<template>
  <div class="system-settings-container grey lighten-2">
    <div class="heading"></div>
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
  padding: 46px 0 75px 0;
}

.heading {
  position: absolute;
  top: 0;
  left: 0;
  height: 110px;
  width: 100%;
  background: #455a64;
  box-shadow:
    0px 3px 5px -1px rgba(0,0,0,0.2),
    0px 5px 8px 0px rgba(0,0,0,0.14),
    0px 1px 14px 0px rgba(0,0,0,0.12);
}
</style>
