<template>
  <div class="row courses-list">
    <cube-spinner v-if="fetchStatus.request"></cube-spinner>
    <div v-else v-for="course in courses" class="col-lg-4">
      <card
        :id="course.id"
        :title="course.title"
        :description="course.description"
      ></card>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import Card from './Card';
  import CubeSpinner from '../loaders/CubeSpinner';

  export default {
    name: 'courses-list',

    components: {
      Card,
      CubeSpinner
    },

    created() {
      this.fetchCourses();
    },

    computed: {
      ...mapGetters({
        courses: 'getCourses',
        fetchStatus: 'getCoursesFetchStatus'
      })
    },

    methods: {
      ...mapActions([
        'fetchCourses'
      ])
    }
  };
</script>

<style lang="scss">
  .courses-list {
    padding: 60px 40px;
  }
</style>
