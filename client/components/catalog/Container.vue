<template>
  <div class="catalog">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search :spinner="searchSpinner" @change="filterCourses"></search>
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
          :loader="courseLoader">
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
      courseLoader: true,
      searchSpinner: false
    };
  },
  computed: mapGetters(['courses']),
  methods: {
    ...mapActions(['fetch'], 'courses'),
    ...mapMutations(['setSearch'], 'courses'),
    fetchCourses() {
      this.courseLoader = true;
      return this.fetch().then(() => {
        this.courseLoader = false;
      });
    },
    filterCourses(query) {
      this.setSearch(query);
      this.searchSpinner = true;
      Promise.resolve(this.fetchCourses())
        .delay(2000)
        .then(() => {
          this.searchSpinner = false;
        });
    }
  },
  created() {
    this.fetchCourses();
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
