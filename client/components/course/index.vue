<template>
  <div class="repo-container">
    <div class="course-header primary">
      <v-tabs
        height="50"
        color="primary"
        slider-color="grey lighten-4"
        dark>
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
      <active-users :users="courseActiveUsers"/>
    </div>
    <div class="tab-content" infinite-wrapper>
      <router-view :showLoader="showLoader"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import ActiveUsers from 'components/common/ActiveUsers';
import filter from 'lodash/filter';
import orderBy from 'lodash/orderBy';
import Promise from 'bluebird';

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
    ...mapGetters(['activeUsers'], 'activeUsers'),
    ...mapGetters(['isAdmin']),
    ...mapGetters(['course', 'activities', 'activity', 'isCourseAdmin'], 'course'),
    tabs() {
      const items = [
        { name: 'Structure', route: 'course', icon: 'file-tree' },
        { name: 'Graph View', route: 'tree-view', icon: 'source-fork mdi-rotate-180' },
        { name: 'History', route: 'course-revisions', icon: 'history' },
        { name: 'Settings', route: 'course-info', icon: 'settings-outline' }
      ];
      if (!this.isAdmin && !this.isCourseAdmin) items.pop();
      return items;
    },
    courseActiveUsers() {
      return orderBy(this.activeUsers.course[this.courseId], 'created', 'desc') || [];
    }
  },
  methods: {
    ...mapActions(['getActiveUsers'], 'activeUsers'),
    ...mapActions(['getUsers'], 'course'),
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapMutations({ resetActivityFocus: 'focusActivity' }, 'course'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupCommentsApi: 'setBaseUrl' }, 'comments'),
    ...mapMutations({ setupRevisionApi: 'setBaseUrl' }, 'revisions'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes')
  },
  async created() {
    const { courseId } = this;
    const existingSelection = this.activity && this.activity.courseId === courseId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/courses/${courseId}/activities`);
    this.setupCommentsApi(`/courses/${courseId}/comments`);
    this.setupRevisionApi(`/courses/${courseId}/revisions`);
    this.setupTesApi(`/courses/${courseId}/tes`);
    const actions = [this.getActivities(), this.getUsers()];
    if (!this.course) actions.push(this.getCourse(courseId));
    await Promise.all(actions);
    this.getActiveUsers(courseId);
    this.showLoader = false;
    const activities = filter(this.activities, { parentId: null });
    if (!existingSelection && activities.length) {
      this.resetActivityFocus(orderBy(activities, 'position')[0]._cid);
    }
  },
  components: { ActiveUsers }
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

.course-header {
  display: flex;
  justify-content: space-between;
}

.v-tabs {
  z-index: 2;
}

.active-users {
  margin-right: 2.6rem;
}
</style>
