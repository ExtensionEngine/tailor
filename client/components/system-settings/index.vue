<template>
  <div class="grey lighten-2 system-settings-container">
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

<style>
.system-settings-container {
  padding-bottom: 75px;
}
</style>
