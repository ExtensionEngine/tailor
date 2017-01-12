<template>
  <div class="catalog">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search :spinner="showLoader" @change="filterCourses"></search>
      </div>
      <div class="col-md-3">
        <div class="create">
          <create-course></create-course>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <course-list
          :courses="courses"
          :loader="showLoader">
        </course-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import Promise from 'bluebird';
import CourseList from './List';
import CreateCourse from './Create';
import Search from './Search';

export default {
  name: 'catalog',
  data() {
    return {
      showLoader: false
    };
  },
  computed: mapGetters(['courses']),
  methods: {
    ...mapActions(['fetch'], 'courses'),
    ...mapMutations(['resetPagination', 'setSearch'], 'courses'),
    fetchWithLoader() {
      const minDelay = 2000;

      this.resetPagination();
      this.showLoader = true;
      Promise.join(this.fetch(), Promise.delay(minDelay)).then(() => {
        this.showLoader = false;
      });
    },
    filterCourses(query) {
      this.setSearch(query);
      this.fetchWithLoader();
    }
  },
  created() {
    this.fetchWithLoader();
  },
  beforeDestroy() {
    // state cleanup
    this.setSearch('');
  },
  components: {
    CreateCourse,
    CourseList,
    Search
  }
};
</script>

<style lang="scss">
.catalog {
  padding: 20px 100px 100px 100px;

  @media (min-width: 1700px) {
    padding: 20px 300px 100px 300px;
  }

  .create {
    position: absolute;
    right: 60px;
  }
}
</style>
