<template>
  <div class="courses">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <courses-search></courses-search>
      </div>
    </div>
  </div>
</template>

<script>
  import CoursesSearch from '../components/courses/Search';

  export default {
    name: 'courses',

    components: {
      CoursesSearch
    }
  };
</script>

<style lang="scss">
  .courses {
    padding-top: 40px;
  }
</style>
