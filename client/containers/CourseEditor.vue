<template>
  <div class="course-editor">
    <cube-spinner v-if="fetchStatus.request"></cube-spinner>
    <div v-else>
      <h1>{{course.title}}</h1>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import CubeSpinner from '../components/loaders/CubeSpinner';

  export default {
    name: 'course-edit',

    components: {
      CubeSpinner
    },

    methods: {
      ...mapActions([
        'fetchCourse'
      ])
    },

    computed: {
      ...mapGetters({
        course: 'getCourse',
        fetchStatus: 'getCourseFetchStatus'
      })
    },

    mounted() {
      this.fetchCourse(this.$route.params.courseId);
    }
  };
</script>

<style lang="scss">
  .course-editor {

  }
</style>
