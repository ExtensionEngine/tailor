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
    <div class="row course-list">
      <course-card
        v-for="course in orderedCourses"
        :key="course._cid"
        :course="course">
      </course-card>
      <infinite-loading @infinite="fetchCourses" ref="infiniteLoading">
        <span slot="spinner" class="col-lg-12 progress-wrapper">
          <circular-progress/>
        </span>
        <span slot="no-results">No courses found.</span>
        <span slot="no-more"></span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import CircularProgress from 'components/common/CircularProgress';
import CourseCard from './Card';
import CreateCourse from './Create';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import orderBy from 'lodash/orderBy';
import Promise from 'bluebird';
import Search from './Search';

export default {
  computed: {
    ...mapGetters(['courses']),
    ...mapGetters(['hasMoreResults'], 'courses'),
    loaderState() {
      return get(this.$refs, 'infiniteLoading.stateChanger', {});
    },
    orderedCourses() {
      return orderBy(this.courses, 'updatedAt', 'desc');
    }
  },
  methods: {
    ...mapActions(['fetch'], 'courses'),
    ...mapMutations(['setSearch'], 'courses'),
    fetchCourses() {
      return Promise.join(this.fetch(), Promise.delay(600)).then(() => {
        this.loaderState.loaded();
        if (!this.hasMoreResults) this.loaderState.complete();
      });
    },
    search(query) {
      this.setSearch(query);
      this.$nextTick(() => this.loaderState.reset());
    }
  },
  mounted() {
    this.search();
  },
  components: {
    CourseCard,
    CreateCourse,
    InfiniteLoading,
    Search,
    CircularProgress
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

.progress-wrapper { margin-top: 50px; }
</style>
