<template>
  <v-container fluid>
    <v-layout>
      <v-card>
        <sidebar :routes="routes"/>
      </v-card>
      <v-flex>
        <router-view/>
      </v-flex>
    </v-layout>
  </v-container>
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
.layout {
  align-items: flex-start;
  justify-content: center;
}

.flex {
  max-width: 58rem;
  margin-left: 48px;
}
</style>
