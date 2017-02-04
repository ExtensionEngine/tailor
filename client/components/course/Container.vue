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
    </ul>
    <div class="tab-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex-module';

export default {
  methods: {
    ...mapActions({ getCourse: 'get' }, 'courses'),
    ...mapActions({ getActivities: 'fetch' }, 'activity'),
    ...mapMutations({ setupActivityApi: 'setBaseUrl' }, 'activity')
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
  created() {
    const courseId = this.$route.params.courseKey;
    // TODO: Do this better!
    this.setupActivityApi(`/courses/${courseId}/activities`);
    if (!this.course) this.getCourse(courseId);
    this.getActivities();
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
