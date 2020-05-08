<template>
  <div class="repo-container">
    <div class="repository-header primary elevation-2">
      <v-tabs
        background-color="blue-grey darken-3"
        slider-color="grey lighten-2"
        slider-size="3"
        dark
        class="elevation-1">
        <v-tab
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.route }"
          active-class="tab-active"
          ripple exact
          class="px-4">
          <v-icon class="pr-2">mdi-{{ tab.icon }}</v-icon>{{ tab.name }}
        </v-tab>
      </v-tabs>
      <active-users :users="getActiveUsers('repository', repositoryId)" />
    </div>
    <div class="tab-content" infinite-wrapper>
      <router-view :show-loader="showLoader" :repository-id="repositoryId" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import ActiveUsers from 'components/common/ActiveUsers';
import filter from 'lodash/filter';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

export default {
  props: {
    repositoryId: { type: Number, required: true }
  },
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters('activeUsers', ['getActiveUsers']),
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['repository', 'activities', 'selectedActivity', 'isRepositoryAdmin']),
    tabs() {
      const items = [
        { name: 'Structure', route: 'repository', icon: 'file-tree' },
        { name: 'Graph View', route: 'tree-view', icon: 'graph-outline' },
        { name: 'History', route: 'revisions', icon: 'history' },
        { name: 'Settings', route: 'repository-info', icon: 'settings-outline' }
      ];
      if (!this.isAdmin && !this.isRepositoryAdmin) items.pop();
      if (!get(this.activities, 'length')) items.splice(1, 2);
      return items;
    }
  },
  methods: {
    ...mapActions('repository', ['initialize']),
    ...mapActions('activeUsers', { setupActivityUsersApi: 'setEndpoint' }),
    ...mapMutations('repository', ['selectActivity'])
  },
  async created() {
    const { repositoryId, selectedActivity: activity } = this;
    await this.initialize(repositoryId);
    this.setupActivityUsersApi(`/repository/${repositoryId}/active-users`);
    const isActivitySelected = get(activity, 'repositoryId') === repositoryId;
    if (!isActivitySelected) {
      const rootActivities = filter(this.activities, { parentId: null });
      const activityCid = rootActivities.length
        ? sortBy(rootActivities, 'position')[0]._cid
        : null;
      this.selectActivity(activityCid);
    }
    this.showLoader = false;
  },
  components: { ActiveUsers }
};
</script>

<style lang="scss" scoped>
.repo-container, .tab-content {
  width: 100%;
  height: 100%;
}

.repo-container {
  display: flex;
  flex-direction: column;

  .repository-header {
    display: flex;
    justify-content: space-between;
  }

  .tab-content {
    overflow-y: scroll;
    overflow-y: overlay;
  }
}

.v-tabs {
  z-index: 2;

  ::v-deep .v-tabs-bar.theme--dark .v-tab {
    &.v-tab--active {
      color: rgba(255, 255, 255, 0.6);
    }

    &:not(.v-tab--active) {
      opacity: 1;
    }
  }
}
</style>
