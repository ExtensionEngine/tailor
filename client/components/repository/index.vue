<template>
  <div class="repo-container">
    <v-tabs
      background-color="blue-grey darken-3"
      slider-color="grey lighten-2"
      slider-size="3"
      dark
      class="elevation-1">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.route, params: tab.params }"
        active-class="tab-active"
        ripple exact
        class="px-4">
        <v-icon class="pr-2">mdi-{{ tab.icon }}</v-icon>{{ tab.name }}
      </v-tab>
    </v-tabs>
    <div class="tab-content" infinite-wrapper>
      <router-view :show-loader="showLoader" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import filter from 'lodash/filter';
import get from 'lodash/get';
import sortBy from 'lodash/sortBy';

export default {
  props: {
    repositoryId: { type: Number, required: true }
  },
  data: () => ({ showLoader: true, lastSelectedActivity: null }),
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['repository', 'activities', 'selectedActivity', 'isRepositoryAdmin']),
    tabs() {
      const params = {
        repositoryId: get(this.lastSelectedActivity, 'repositoryId'),
        activityId: get(this.lastSelectedActivity, 'id')
      };
      const items = [
        { name: 'Structure', route: 'repository', icon: 'file-tree', params },
        { name: 'Graph View', route: 'tree-view', icon: 'graph-outline', params },
        { name: 'History', route: 'revisions', icon: 'history' },
        { name: 'Settings', route: 'repository-info', icon: 'settings-outline' }
      ];
      if (!this.isAdmin && !this.isRepositoryAdmin) items.pop();
      if (!get(this.activities, 'length')) items.splice(1, 2);
      return items;
    }
  },
  methods: mapActions('repository', ['initialize', 'expandParents']),
  watch: {
    selectedActivity(val) {
      if (val) this.lastSelectedActivity = val;
    }
  },
  async created() {
    const { repositoryId } = this;
    await this.initialize(repositoryId);
    if (!this.selectedActivity) {
      const rootActivities = filter(this.activities, { parentId: null });
      const activity = rootActivities.length
        ? sortBy(rootActivities, 'position')[0]
        : null;
      this.$router.push({
        name: 'repository',
        params: { activityId: activity.id }
      });
    }
    this.expandParents(this.selectedActivity);
    this.showLoader = false;
  }
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
