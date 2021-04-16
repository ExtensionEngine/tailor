<template>
  <div class="repo-container">
    <div class="repo-toolbar primary darken-3 elevation-2">
      <v-tabs
        background-color="primary darken-3"
        slider-color="grey lighten-2"
        slider-size="3"
        height="60"
        dark>
        <v-tab
          v-for="tab in tabs"
          :key="tab.name"
          :to="{ name: tab.route, query: tab.query }"
          active-class="tab-active"
          ripple
          class="px-4">
          <v-icon class="pr-2">mdi-{{ tab.icon }}</v-icon>{{ tab.name }}
        </v-tab>
      </v-tabs>
      <active-users :users="activeUsers" class="px-6" />
    </div>
    <div class="tab-content" infinite-wrapper>
      <router-view :show-loader="showLoader" />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { ActiveUsers } from '@tailor/components';
import filter from 'lodash/filter';
import get from 'lodash/get';
import selectActivity from '@/components/repository/common/selectActivity';
import sortBy from 'lodash/sortBy';
import withUserTracking from 'components/common/mixins/userTracking';

const getTabItems = ({ hasWorkflow, hasSettingsAvailable, hasActivities, query }) => [
  {
    name: 'Structure',
    route: 'repository',
    icon: 'file-tree'
  },
  hasActivities && hasWorkflow && {
    name: 'Progress',
    route: 'progress',
    icon: 'chart-timeline-variant'
  },
  hasActivities && {
    name: 'History',
    route: 'revisions',
    icon: 'history'
  },
  hasSettingsAvailable && {
    name: 'Settings',
    route: 'repository-info',
    icon: 'settings-outline'
  }
].filter(Boolean).map(tab => ({ ...tab, query }));

export default {
  mixins: [selectActivity, withUserTracking],
  props: {
    repositoryId: { type: Number, required: true }
  },
  data: () => ({ showLoader: true, lastSelectedActivity: null }),
  computed: {
    ...mapGetters('repository/userTracking', ['getActiveUsers']),
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', [
      'repository',
      'activities',
      'isRepositoryAdmin',
      'hasWorkflow'
    ]),
    activeUsers() {
      return this.getActiveUsers('repository', this.repositoryId);
    },
    tabs() {
      const { isAdmin, isRepositoryAdmin, hasWorkflow } = this;
      const hasSettingsAvailable = isAdmin || isRepositoryAdmin;
      const hasActivities = get(this.activities, 'length');
      const activityId = get(this.lastSelectedActivity, 'id');
      const query = { ...this.$route.query, ...activityId && { activityId } };
      return getTabItems({ hasSettingsAvailable, hasWorkflow, hasActivities, query });
    }
  },
  methods: mapActions('repository', ['initialize', 'expandParents']),
  provide() {
    const $editorContent = {};
    Object.defineProperties($editorContent, {
      repository: {
        get: () => this.repository,
        enumerable: true
      },
      activities: {
        get: () => this.activities,
        enumerable: true
      }
    });
    return { $editorContent };
  },
  watch: {
    selectedActivity: {
      handler(val) {
        if (!val) return;
        this.lastSelectedActivity = val;
        this.expandParents(val);
      },
      immediate: true
    }
  },
  async created() {
    const { repositoryId } = this;
    await this.initialize(repositoryId);
    this.showLoader = false;
    if (!this.activities.length || this.selectedActivity) return;
    const rootActivities = filter(this.activities, { parentId: null });
    const [activity] = sortBy(rootActivities, 'position');
    this.selectActivity(activity.id);
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

  .tab-content {
    overflow-y: scroll;
    overflow-y: overlay;
  }
}

.repo-toolbar {
  display: flex;
  justify-content: space-between;
  height: 3.75rem;
  z-index: 2;
}

.v-tabs {
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
