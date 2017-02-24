<template>
  <div class="course-container">
    <ul class="nav nav-tabs">
      <!-- TODO: Create component for nav tabs -->
      <li :class="{ active: $route.name === 'course' }">
        <router-link :to="{ name: 'course' }">Outline</router-link>
      </li>
      <li v-if="showSettings"
        :class="{ active: $route.name === 'course-settings' }">
        <router-link :to="{ name: 'course-settings' }">Settings</router-link>
      </li>
      <li v-if="showDetails"
        :class="{ active: $route.name === 'course-details' }">
        <router-link :to="{ name: 'course-details' }">Details</router-link>
      </li>
      <li :class="{ active: $route.name === 'course-revisions' }">
        <router-link :to="{ name: 'course-revisions' }">Revisions</router-link>
      </li>
    </ul>
    <div class="tab-content">
      <router-view :showLoader="showLoader"></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import modalBus from '../common/deletionModal/eventBus';

export default {
  data() {
    return {
      showLoader: true
    };
  },
  computed: {
    ...mapGetters(['course'], 'editor'),
    ...mapGetters(['isAdmin', 'isCourseAdmin']),
    showSettings() {
      return this.isAdmin || this.isCourseAdmin;
    },
    showDetails() {
      return this.isAdmin || this.isCourseAdmin;
    }
  },
  methods: {
    ...mapActions({ getCourse: 'get', removeCourse: 'remove' }, 'courses'),
    ...mapActions({ getActivities: 'fetch', removeActivity: 'remove' }, 'activity'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activity'),
    createEvents() {
      modalBus.$on('activity/delete', this.removeActivity);
      modalBus.$on('course/delete', (course) => {
        this.removeCourse(course).then(() => this.$router.push('/'));
      });
    },
    removeEvents() {
      modalBus.$off('activity/delete');
      modalBus.$off('course/delete');
    }
  },
  created() {
    const courseId = this.$route.params.courseKey;
    // TODO: Do this better!
    this.setupActivityApi(`/courses/${courseId}/activities`);
    if (!this.course) this.getCourse(courseId);
    this.getActivities().then(() => (this.showLoader = false));
    this.createEvents();
  },
  destroyed() {
    this.removeEvents();
  }
};
</script>

<style lang="scss">
.course-container, .tab-content, .tab-pane {
  width: 100%;
  height: 100%;
}

.course-container {
  .nav-tabs {
    position: fixed;
    width: 100%;
    background-color: white;

    li a {
      font-size: 16px;
    }
  }

  .tab-content {
    padding-top: 41px;
  }
}
</style>
