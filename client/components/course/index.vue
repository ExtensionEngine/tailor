<template>
  <div class="course-container">
    <ul class="nav nav-tabs">
      <!-- TODO: Create component for nav tabs -->
      <li :class="{ active: $route.name === 'course' }">
        <router-link :to="{ name: 'course' }">Outline</router-link>
      </li>
      <li :class="{ active: $route.name === 'tree-view' }">
        <router-link :to="{ name: 'tree-view' }">Tree View</router-link>
      </li>
      <li :class="{ active: $route.name === 'course-revisions' }">
        <router-link :to="{ name: 'course-revisions' }">Revisions</router-link>
      </li>
      <li v-if="showSettings"
        :class="{ active: $route.matched.some(it => it.name === 'course-info') }">
        <router-link :to="{ name: 'course-info' }">Settings</router-link>
      </li>
    </ul>
    <div class="tab-content" infinite-wrapper>
      <router-view :showLoader="showLoader"></router-view>
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
    ...mapGetters(['course', 'activities', 'activity'], 'course'),
    ...mapGetters(['isAdmin', 'isCourseAdmin']),
    showSettings() {
      return this.isAdmin || this.isCourseAdmin;
    },
    showDetails() {
      return this.isAdmin || this.isCourseAdmin;
    }
  },
  methods: {
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activities'),
    ...mapMutations({ resetActivityFocus: 'focusActivity' }, 'course'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activities'),
    ...mapMutations({ setupRevisionApi: 'setBaseUrl' }, 'revisions'),
    ...mapMutations({ setupTesApi: 'setBaseUrl' }, 'tes')
  },
  created() {
    const { courseId } = this.$route.params;
    const existingSelection = this.activity && this.activity.courseId === courseId;
    if (!existingSelection) this.resetActivityFocus();
    // TODO: Do this better!
    this.setupActivityApi(`/courses/${courseId}/activities`);
    this.setupRevisionApi(`/courses/${courseId}/revisions`);
    this.setupTesApi(`/courses/${courseId}/tes`);
    if (!this.course) this.getCourse(courseId);
    return Promise.join(this.getActivities(), Promise.delay(800)).then(() => {
      this.showLoader = false;
      let activities = filter(this.activities, { parentId: null });
      activities = sortBy(activities, 'position');
      if (!existingSelection) this.resetActivityFocus(activities[0]._cid);
    });
  }
};
</script>

<style lang="scss">
.course-container, .tab-content, .tab-pane {
  width: 100%;
  height: 100%;
}

.course-container {
  display: flex;
  flex-direction: column;

  .nav-tabs {
    width: 100%;
    background-color: white;
    z-index: 1;

    li a {
      font-size: 16px;
    }
  }

  .tab-content {
    overflow-y: scroll;
    overflow-y: overlay;
  }
}
</style>
