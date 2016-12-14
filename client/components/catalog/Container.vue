<template>
  <div class="catalog-container">
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
  import CourseCreate from './Create';
  import CoursesList from './List';
  import CoursesSearch from './Search';

  export default {
    name: 'courses',

    components: {
      CourseCreate,
      CoursesList,
      CoursesSearch
    }
  };
</script>

<style lang="scss">
.catalog-container {
  padding: 20px 100px 100px 100px;

  @media (min-width: 1700px) {
    padding: 20px 300px 100px 300px;
  }

  .create-action {
    position: absolute;
    right: 60px;
  }
}
</style>
