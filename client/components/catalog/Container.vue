<template>
  <div class="catalog" infinite-wrapper>
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search @change="search"></search>
      </div>
      <div class="col-md-3">
        <create-course class="pull-right"></create-course>
      </div>
    </div>
    <div v-show="searching" class="search-spinner"><circular-progress/></div>
    <div v-show="!searching" class="row course-list">
      <course-card
        v-for="course in orderedCourses"
        :key="course._cid"
        :course="course">
      </course-card>
      <infinite-loading @infinite="loadMore" ref="infiniteLoading">
        <div slot="spinner" class="spinner"><circular-progress/></div>
        <div slot="no-results" class="no-results">No courses found.</div>
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
import isEmpty from 'lodash/isEmpty';
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import orderBy from 'lodash/orderBy';
import Promise from 'bluebird';
import Search from './Search';

export default {
  data() {
    return { searching: false };
  },
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
    loadMore() {
      return this.fetch().then(() => {
        if (!isEmpty(this.courses)) this.loaderState.loaded();
        if (!this.hasMoreResults) this.loaderState.complete();
      });
    },
    load(query) {
      this.loaderState.loaded();
      this.loaderState.complete();
      return Promise.join(this.fetch({ reset: true }), Promise.delay(1000))
        .then(() => {
          this.loaderState.reset();
          if (!isEmpty(this.courses)) this.loaderState.loaded();
          if (!this.hasMoreResults) this.loaderState.complete();
        });
    },
    search(query) {
      this.setSearch(query);
      this.searching = true;
      return this.load().then(() => (this.searching = false));
    }
  },
  mounted() {
    this.search();
  },
  components: {
    CircularProgress,
    CourseCard,
    CreateCourse,
    InfiniteLoading,
    Search
  }
};
</script>

<style lang="scss" scoped>
.catalog {
  padding: 20px 100px 100px;
  overflow-y: scroll;
  overflow-y: overlay;

  @media (min-width: 1700px) {
    padding: 20px 300px 100px;
  }
}

.search-spinner {
  margin-top: 48px;
}

.spinner, .no-results {
  margin-top: 36px;
}
</style>
