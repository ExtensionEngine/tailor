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
        :to="{ name: tab.route, query: tab.query }"
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
import selectActivity from '@/components/repository/common/selectActivity';
import sortBy from 'lodash/sortBy';

export default {
  mixins: [selectActivity],
  props: {
    repositoryId: { type: Number, required: true }
  },
  data: () => ({ showLoader: true, lastSelectedActivity: null }),
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['repository', 'activities', 'isRepositoryAdmin']),
    tabs() {
      const hasActivities = get(this.activities, 'length');
      const activityId = get(this.lastSelectedActivity, 'id');
      const query = { ...this.$route.query, activityId };
      const items = [
        { name: 'Structure', route: 'repository', icon: 'file-tree', query },
        hasActivities && { name: 'Board', route: 'board', icon: 'view-dashboard-variant', query },
        hasActivities && { name: 'Graph View', route: 'tree-view', icon: 'graph-outline', query },
        hasActivities && { name: 'History', route: 'revisions', icon: 'history' },
        { name: 'Settings', route: 'repository-info', icon: 'settings-outline' }
      ].filter(Boolean);
      if (!this.isAdmin && !this.isRepositoryAdmin) items.pop();
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
    this.showLoader = false;
    if (!this.activities.length) return;
    if (!this.selectedActivity) {
      const rootActivities = filter(this.activities, { parentId: null });
      const [activity] = sortBy(rootActivities, 'position');
      this.selectActivity(activity.id);
    }
    this.expandParents(this.selectedActivity);
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
