<template>
  <div class="system-settings-container grey lighten-2">
    <v-container>
      <v-layout row align-start>
        <v-card>
          <sidebar :routes="routes"/>
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
import AppFooter from 'components/common/Footer';
import Sidebar from 'components/common/SettingsSidebar';

export default {
  computed: {
    routes() {
      return [
        { label: 'System Users', name: 'system-user-management', icon: 'account' },
        { label: 'Structure Types', name: 'installed-schemas', icon: 'file-tree' },
        { label: 'Installed Elements', name: 'installed-elements', icon: 'puzzle' }
      ];
    }
  },
  components: {
    AppFooter,
    Sidebar
  }
};
</script>

<style lang="scss" scoped>
.system-settings-container {
  padding: 25px 0 75px 0;
}
</style>
