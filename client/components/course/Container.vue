<template>
  <div class="course-container">
    <ul class="nav nav-tabs">
      <!-- TODO: Create component for nav tabs -->
      <li :class="{ active: $route.name === 'course' }">
        <router-link :to="{ name: 'course' }">Outline</router-link>
      </li>
      <li><a>Revision history</a></li>
      <li><a>Comments</a></li>
      <li
        :class="{ active: $route.name === 'course-settings' }"
        v-permissions.isSystemAdmin.isAdmin>
        <router-link :to="{ name: 'course-settings' }">Settings</router-link>
      </li>
    </ul>
    <div class="tab-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import Permissions from '../../directives/permissions';

export default {
  methods: {
    ...mapActions(['fetch'], 'activity'),
    ...mapMutations(['activateCourse'], 'activity')
  },
  created() {
    this.activateCourse(this.$route.params.courseKey);
    this.fetch();
  },
  directives: {
    Permissions
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
