<template>
  <div class="course-editor">
    <h1>{{course.title}}</h1>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  export default {
    name: 'course-edit',

    methods: {
      ...mapActions([
        'fetchCourse'
      ])
    },

    computed: {
      ...mapGetters({
        course: 'getCourse'
      })
    },

    created() {
      this.fetchCourse(this.$route.params.courseId);
    }
  };
</script>

<style lang="scss">
  .course-editor {

  }
</style>
