<template>
  <div class="row course-list">
    <course-card
      v-for="course in orderedCourses"
      :key="course._cid"
      :course="course">
    </course-card>
  </div>
</template>

<script>
import CourseCard from './Card';
import orderBy from 'lodash/orderBy';

export default {
  name: 'course-list',
  props: {
    courses: { type: Object, required: true }
  },
  computed: {
    orderedCourses() {
      return orderBy(this.courses, 'updatedAt', 'desc');
    }
  },
  components: { CourseCard }
};
</script>

