<template>
  <div class="repo-container">
    <v-tabs
      height="50"
      background-color="primary"
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
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';

export default {
  props: {
    courseId: { type: Number, required: true }
  },
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('course', ['course', 'activities', 'activity', 'isCourseAdmin']),
    tabs() {
      const items = [
        { name: 'Structure', route: 'course', icon: 'file-tree' },
        { name: 'Graph View', route: 'tree-view', icon: 'source-fork mdi-rotate-180' },
        { name: 'History', route: 'course-revisions', icon: 'history' },
        { name: 'Settings', route: 'course-info', icon: 'settings-outline' }
      ];
      if (!this.isAdmin && !this.isCourseAdmin) items.pop();
      return items;
    }
  },
  methods: {
    ...mapActions('course', ['getUsers']),
    ...mapActions('courses', { getCourse: 'get' }),
    ...mapActions('activities', { getActivities: 'fetch' }),
    ...mapActions('activities', { setupActivityApi: 'setEndpoint' }),
    ...mapActions('comments', { setupCommentsApi: 'setEndpoint' }),
    ...mapActions('revisions', { setupRevisionApi: 'setEndpoint' }),
    ...mapActions('tes', { setupTesApi: 'setEndpoint' }),
    ...mapMutations('course', { resetActivityFocus: 'focusActivity' })
  },
  async created() {
    const { courseId } = this;
    const existingSelection = this.activity && this.activity.courseId === courseId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/repositories/${courseId}/activities`);
    this.setupCommentsApi(`/repositories/${courseId}/comments`);
    this.setupRevisionApi(`/repositories/${courseId}/revisions`);
    this.setupTesApi(`/repositories/${courseId}/content-elements`);
    const actions = [this.getActivities(), this.getUsers()];
    if (!this.course) actions.push(this.getCourse(courseId));
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
