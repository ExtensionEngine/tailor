<template>
  <div class="repo-container">
    <v-tabs slider-color="grey darken-2" light>
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
      <router-view :showLoader="showLoader"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import filter from 'lodash/filter';
import Promise from 'bluebird';
import sortBy from 'lodash/sortBy';

const tabs = [
  { name: 'Structure', route: 'course', icon: 'file-tree' },
  { name: 'Graph View', route: 'tree-view', icon: 'source-fork mdi-rotate-180' },
  { name: 'History', route: 'course-revisions', icon: 'history' },
  { name: 'Comments', route: 'comments', icon: 'comment-text-outline' },
  { name: 'Settings', route: 'course-info', icon: 'settings-outline' }
];

export default {
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['isAdmin', 'isCourseAdmin']),
    ...mapGetters(['course', 'activities', 'activity'], 'course'),
    tabs() {
      if (!this.isAdmin && !this.isCourseAdmin) tabs.pop();
      return tabs;
    }
  },
  methods: {
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapMutations({ resetActivityFocus: 'focusActivity' }, 'course'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupCommentsApi: 'setBaseUrl' }, 'comments'),
    ...mapMutations({ setupRevisionApi: 'setBaseUrl' }, 'revisions'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes')
  },
  created() {
    const { courseId } = this.$route.params;
    const existingSelection = this.activity && this.activity.courseId === courseId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/courses/${courseId}/activities`);
    this.setupCommentsApi(`/courses/${courseId}/comments`);
    this.setupRevisionApi(`/courses/${courseId}/revisions`);
    this.setupTesApi(`/courses/${courseId}/tes`);
    if (!this.course) this.getCourse(courseId);
    return Promise.join(this.getActivities(), Promise.delay(500)).then(() => {
      this.showLoader = false;
      let activities = filter(this.activities, { parentId: null });
      activities = sortBy(activities, 'position');
      if (!existingSelection && activities.length) {
        this.resetActivityFocus(activities[0]._cid);
      }
    });
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

.tab-active {
  .v-icon {
    color: #263238 !important;
  }
}
</style>
