<template>
  <div class="system-settings-container grey lighten-2">
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
  padding: 20px 0 75px 0;
}
</style>
