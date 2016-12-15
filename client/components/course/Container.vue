<template>
  <div class="row">
    <div class="col-md-2">
      <course-sidebar></course-sidebar>
    </div>

    <div class="col-md-10 col-md-offset-2">
      <div class="course">
        <router-view :course="course"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import CourseSidebar from './Sidebar';

export default {
  components: {
    CourseSidebar
  },

  computed: {
    ...mapGetters({ course: 'getCourse' })
  }
};
</script>

<style lang="scss">
.course {
  margin-left: -5%;
  width: 95%;
}
</style>
