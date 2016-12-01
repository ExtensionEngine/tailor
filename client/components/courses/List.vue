<template>
  <div class="row courses-list">
    <div v-for="course in courses" class="col-lg-4">
      <card :title="course.title" :description="course.description"></card>
    </div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';

  import Card from './Card';

  export default {
    name: 'courses-list',

    components: {
      Card
    },

    created() {
      this.fetchCourses();
    },

    computed: {
      ...mapGetters({
        courses: 'getCourses',
        message: 'getMessage'
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
