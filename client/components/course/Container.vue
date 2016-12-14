<template>
  <div class="row">
    <div class="col-md-2">
      <course-sidebar></course-sidebar>
    </div>

    <div class="col-md-10 col-md-offset-2">
      <div class="course">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import CourseSidebar from './Sidebar';

export default {
  components: {
    CourseSidebar
  }
};
</script>

<style lang="scss">
.course {
  margin-left: -5%;
  width: 95%;
}
</style>
