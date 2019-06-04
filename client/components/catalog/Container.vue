<template>
  <div class="catalog grey lighten-2" infinite-wrapper>
    <div class="row">
      <div class="col-md-6 col-md-offset-3 col-sm-10 col-sm-offset-1">
        <search @change="search"></search>
      </div>
      <div class="col-md-2 col-sm-1">
        <create-course class="pull-right"/>
      </div>
    </div>
    <div v-show="searching" class="search-spinner">
      <v-progress-circular color="primary" indeterminate/>
    </div>
    <div v-show="!searching" class="row course-list">
      <course-card
        v-for="course in orderedCourses"
        :key="course._cid"
        :course="course">
      </course-card>
      <infinite-loading ref="infiniteLoading" @infinite="loadMore">
        <div slot="spinner" class="spinner">
          <v-progress-circular color="primary" indeterminate/>
        </div>
        <div slot="no-results" class="no-results">
          {{ orderedCourses.length ? '' : 'No courses found.' }}
        </div>
        <span slot="no-more"></span>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import CourseCard from './Card';
import CreateCourse from './Create';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import isEmpty from 'lodash/isEmpty';
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
      return Promise.join(this.fetch({ reset: true }), Promise.delay(500))
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
    CourseCard,
    CreateCourse,
    InfiniteLoading,
    Search
  }
};
</script>

<style lang="scss" scoped>
.catalog {
  padding: 30px 100px 100px;

  @media (min-width: 1700px) {
    padding: 30px 300px 100px;
  }

  /deep/ .course-search {
    margin-top: 8px;
  }
}

.search-spinner {
  margin-top: 80px;
}

.spinner, .no-results {
  margin-top: 36px;
}
</style>
