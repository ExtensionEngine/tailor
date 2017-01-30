<template>
  <div class="course-container">
    <ul class="nav nav-tabs">
      <!-- TODO: Create component for nav tabs -->
      <li :class="{ active: $route.name === 'course' }">
        <router-link :to="{ name: 'course' }">Outline</router-link>
      </li>
      <!--
      <li><a>Revision history</a></li>
      <li><a>Comments</a></li>
      -->
      <li v-if="showSettings"
        :class="{ active: $route.name === 'course-settings' }">
        <router-link :to="{ name: 'course-settings' }">Settings</router-link>
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
    ...mapActions(['fetch'], 'activity'),
    ...mapMutations(['activateCourse'], 'activity')
  },
  computed: {
    ...mapGetters(['isAdmin', 'isCourseAdmin']),
    showSettings() {
      return this.isAdmin || this.isCourseAdmin;
    }
  },
  created() {
    this.activateCourse(this.$route.params.courseKey);
    this.fetch();
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
