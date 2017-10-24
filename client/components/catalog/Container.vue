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
    <div class="row courses">
      <course-list :courses="courses"></course-list>
      <infinite-loading @infinite="fetchCourses" ref="infiniteLoading">
        <span slot="spinner" class="col-lg-12 spinner-wrapper">
          <spinner></spinner>
        </span>
        <span slot="no-results">No courses found.</span>
        <span slot="no-more"></span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import CourseList from './List';
import CreateCourse from './Create';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import { mapActions, mapGetters } from 'vuex-module';
import Promise from 'bluebird';
import Spinner from 'components/common/Loader';
import Search from './Search';

export default {
  computed: {
    ...mapGetters(['courses']),
    ...mapGetters(['hasMoreResults'], 'courses'),
    loaderState() {
      return get(this.$refs, 'infiniteLoading.stateChanger', {});
    }
  },
  methods: {
    ...mapActions(['fetch', 'resetSearch'], 'courses'),
    fetchCourses() {
      return Promise.join(this.fetch(), Promise.delay(400))
        .then(() => {
          this.loaderState.loaded();
          if (!this.hasMoreResults) this.loaderState.complete();
        });
    },
    search(query) {
      this.resetSearch(query);
      this.$nextTick(() => this.loaderState.reset());
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
    Spinner
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

.spinner-wrapper,
.well-a {
  margin-top: 50px;
}
</style>
