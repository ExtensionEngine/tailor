<template>
  <div class="repo-container">
    <v-tabs slider-color="grey darken-2" light>
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.route }"
        ripple>
        <v-icon class="pr-2">mdi-{{ tab.icon }}</v-icon>{{ tab.name }}
      </v-tab>
    </v-tabs>
    <div class="tab-content" infinite-wrapper>
      <router-view/>
    </div>
  </div>
</template>

<script>
import UserPrivacy from './Settings/UserPrivacy';
import UserGeneral from './Settings/UserGeneral';

export default {
  data() {
    return {
    };
  },
  computed: {
    tabs() {
      const items = [
        { name: 'General', route: 'general', icon: 'wrench' },
        { name: 'Privacy', route: 'privacy', icon: 'lock-outline' }
      ];
      return items;
    }
  },
  components: { UserGeneral, UserPrivacy }
};
</script>

<style lang="scss">
.repo-container, .tab-content, .tab-pane {
  width: 100%;
  height: 100%;
}

.repo-container {
  display: flex;
  flex-direction: column;

  .tab-content {
    overflow-y: scroll;
    overflow-y: overlay;
  }
}

.tab-active {
  .v-icon {
    color: #263238 !important;
  }
}
</style>
