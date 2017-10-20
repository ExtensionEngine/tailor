<template>
  <div
    v-infinite-scroll="load"
    infinite-scroll-disabled="disabled"
    infinite-scroll-distance="100"
    class="row course-list">
    <course-card
      v-for="course in orderedCourses"
      :key="course._cid"
      :course="course">
    </course-card>
    <div v-if="showLoader && this.hasMoreResults" class="col-lg-12 loader-wrapper">
      <loader></loader>
    </div>
  </div>
</template>

<script>
import CourseCard from './Card';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../common/Loader';
import orderBy from 'lodash/orderBy';

export default {
  name: 'course-list',
  props: {
    courses: { type: Object, required: true },
    hasMoreResults: { type: Boolean, required: true },
    showLoader: { type: Boolean, required: true }
  },
  computed: {
    disabled() {
      return this.showLoader || !this.hasMoreResults;
    },
    orderedCourses() {
      return orderBy(this.courses, 'updatedAt', 'desc');
    }
  },
  methods: {
    load() {
      this.$emit('load');
    }
  },
  components: { CourseCard, Loader },
  directives: { InfiniteScroll }
};
</script>

<style lang="scss" scoped>
.loader {
  margin-top: 100px;
}
</style>
