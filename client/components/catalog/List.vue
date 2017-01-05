<template>
  <div class="row course-list">
    <cube-spinner v-if="loader"></cube-spinner>
    <div v-else v-for="course in courses" class="col-lg-4">
      <card
        :id="course._cid"
        :name="course.name"
        :description="course.description">
      </card>
    </div>
  </div>
</template>

<script>
import Card from './Card';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-list',
  props: {
    courses: {
      type: Object,
      required: true
    },
    loader: {
      type: Boolean,
      required: true
    }
  },
  components: {
    Card,
    CubeSpinner
  }
};
</script>
