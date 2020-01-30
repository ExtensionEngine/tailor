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
        :to="{ name: tab.route }"
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
import { mapActions, mapGetters, mapMutations } from 'vuex';
import filter from 'lodash/filter';
import get from 'lodash/get';
import Promise from 'bluebird';
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
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository',
      ['repository', 'activities', 'activity', 'isRepositoryAdmin']),
    tabs() {
      const items = [
        { name: 'Structure', route: 'repository', icon: 'file-tree' },
        { name: 'Graph View', route: 'tree-view', icon: 'source-fork mdi-rotate-180' },
        { name: 'History', route: 'revisions', icon: 'history' },
        { name: 'Settings', route: 'repository-settings', icon: 'settings-outline' }
      ];
      if (!this.isAdmin && !this.isRepositoryAdmin) items.pop();
      return items;
    }
  },
  methods: {
    ...mapActions('repository', ['getUsers']),
    ...mapActions('repositories', { getRepository: 'get' }),
    ...mapActions('activities', { getActivities: 'fetch' }),
    ...mapActions('activities', { setupActivityApi: 'setEndpoint' }),
    ...mapActions('comments', { setupCommentsApi: 'setEndpoint' }),
    ...mapActions('revisions', { setupRevisionApi: 'setEndpoint' }),
    ...mapActions('tes', { setupTesApi: 'setEndpoint' }),
    ...mapMutations('repository', { resetActivityFocus: 'focusActivity' })
  },
  async created() {
    const { repositoryId, activity } = this;
    const existingSelection = get(activity, 'repositoryId') === repositoryId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/repositories/${repositoryId}/activities`);
    this.setupCommentsApi(`/repositories/${repositoryId}/comments`);
    this.setupRevisionApi(`/repositories/${repositoryId}/revisions`);
    this.setupTesApi(`/repositories/${repositoryId}/content-elements`);
    const actions = [this.getActivities(), this.getUsers()];
    if (!this.repository) actions.push(this.getRepository(repositoryId));
    await Promise.all(actions);
    this.showLoader = false;
    const activities = filter(this.activities, { parentId: null });
    if (!existingSelection && activities.length) {
      this.resetActivityFocus(sortBy(activities, 'position')[0]._cid);
    }
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
