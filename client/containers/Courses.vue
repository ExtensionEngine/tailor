<template>
  <div class="courses">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <courses-search></courses-search>
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
  import CoursesSearch from '../components/courses/Search';
  import CoursesList from '../components/courses/List';

  export default {
    name: 'courses',

    components: {
      CoursesList,
      CoursesSearch
    }
  };
</script>

<style lang="scss">
  .courses {
    padding-top: 40px;
  }
</style>
