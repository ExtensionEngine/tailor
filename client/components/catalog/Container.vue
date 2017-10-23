<template>
  <div class="catalog">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search @change="search"></search>
      </div>
      <div class="col-md-3">
        <create-course class="pull-right"></create-course>
      </div>
    </div>
    <div class="row">
      <course-list :courses="courses"></course-list>
      <infinite-loading @infinite="fetchCourses" ref="infiniteLoading">
        <span slot="spinner">
          <div class="col-lg-12 loader-wrapper"><loader></loader></div>
        </span>
        <span slot="no-results">No courses found.</span>
        <span slot="no-more"></span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import CourseList from './List';
import CreateCourse from './Create';
import InfiniteLoading from 'vue-infinite-loading';
import Loader from '../common/Loader';
import Search from './Search';

export default {
  computed: {
    ...mapGetters(['courses']),
    ...mapGetters(['hasMoreResults'], 'courses')
  },
  methods: {
    ...mapActions(['fetch', 'resetSearch'], 'courses'),
    fetchCourses($state) {
      return Promise.join(this.fetch(), Promise.delay(400))
        .then(() => {
          $state.loaded();
          if (!this.hasMoreResults) $state.complete();
        });
    },
    search(query) {
      this.resetSearch(query);
      this.$nextTick(() => {
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
      });
    }
  },
  mounted() {
    this.search();
  },
  components: {
    CreateCourse,
    CourseList,
    InfiniteLoading,
    Search,
    Loader
  }
};
</script>

<style lang="scss" scoped>
.catalog {
  min-height: 101%;
  padding: 20px 100px 100px 100px;

  @media (min-width: 1700px) {
    padding: 20px 300px 100px 300px;
  }
}

.loader-wrapper,
.well-a {
  margin-top: 50px;
}
</style>
