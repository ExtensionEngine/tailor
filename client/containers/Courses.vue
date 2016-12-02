<template>
  <div class="courses">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <courses-search></courses-search>
      </div>

      <div class="col-md-3">
        <div class="create-action">
          <course-create></course-create>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <courses-list></courses-list>
      </div>
    </div>
  </div>
</template>

<script>
  import CourseCreate from '../components/courses/Create';
  import CoursesList from '../components/courses/List';
  import CoursesSearch from '../components/courses/Search';

  export default {
    name: 'courses',

    components: {
      CourseCreate,
      CoursesList,
      CoursesSearch
    },

    beforeRouteLeave(to, from, next) {
      console.log('leave');
      next();
    }
  };
</script>

<style lang="scss">
  .courses {
    padding-top: 40px;

    .create-action {
      position: absolute;
      right: 60px;
    }
  }
</style>
