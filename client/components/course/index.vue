<template>
  <div class="repo-container">
    <v-tabs slider-color="grey darken-2" light>
      <v-tab
        v-for="tab in tabs"
        :key="tab.name"
        :to="{ name: tab.route }"
        ripple>
        {{ tab.name }}
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
      const items = [
        { name: 'Outline', route: 'course' },
        { name: 'Tree View', route: 'tree-view' },
        { name: 'Revisions', route: 'course-revisions' }
      ];
      if (this.isAdmin || this.isCourseAdmin) {
        items.push({ name: 'Settings', route: 'course-info' });
      }
      return items;
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
</style>
