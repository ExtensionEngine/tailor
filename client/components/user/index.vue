<template>
  <div class="user-info-container grey lighten-2">
    <v-container>
      <v-layout row align-start>
        <v-card>
          <sidebar :routes="routes"/>
        </v-card>
        <v-flex ml-4>
          <router-view/>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Sidebar from 'components/common/SettingsSidebar';

export default {
  computed: {
    routes() {
      return [
        { label: 'General', name: 'user-info', icon: 'account' },
        { label: 'Privacy', name: 'user-privacy', icon: 'shield-outline' }
      ];
    }
  },
  components: { Sidebar }
};
</script>

<style lang="scss" scoped>
.user-info-container {
  padding: 25px 0 75px 0;
}
</style>
