<template>
  <div class="repo-container">
    <v-tabs
      height="50"
      color="primary"
      slider-color="grey lighten-4"
      dark
      class="elevation-2">
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.route }"
        active-class="tab-active"
        ripple
        exact
        class="px-1">
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
    ...mapGetters('repository', ['repository', 'activities', 'activity', 'isRepositoryAdmin']),
    tabs() {
      const items = [
        { name: 'Structure', route: 'repository', icon: 'file-tree' },
        { name: 'Graph View', route: 'tree-view', icon: 'source-fork mdi-rotate-180' },
        { name: 'History', route: 'repository-revisions', icon: 'history' },
        { name: 'Settings', route: 'repository-info', icon: 'settings-outline' }
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
    const { repositoryId } = this;
    const existingSelection = this.activity && this.activity.repositoryId === repositoryId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/repositories/${repositoryId}/activities`);
    this.setupCommentsApi(`/repositories/${repositoryId}/comments`);
    this.setupRevisionApi(`/repositories/${repositoryId}/revisions`);
    this.setupTesApi(`/repositories/${repositoryId}/tes`);
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

.v-tabs {
  z-index: 2;
}
</style>
