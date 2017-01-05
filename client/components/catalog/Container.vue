<template>
  <div class="catalog">
    <div class="row">
      <div class="col-md-6 col-md-offset-3">
        <search v-on:query="search"></search>
      </div>
      <div class="col-md-3">
        <div class="create">
          <create-course></create-course>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <course-list :courses="courses" :loader="loader"></course-list>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import CourseList from './List';
import CreateCourse from './Create';
import Search from './Search';

export default {
  name: 'catalog',
  data() {
    return {
      loader: true
    };
  },
  computed: {
    ...mapGetters(['courses'])
  },
  methods: {
    ...mapActions(['fetch'], 'courses'),
    search(name) {
      this.loader = true;
      this.fetch({ name }).then(() => {
        this.loader = false;
      });
    }
  },
  created() {
    this.loader = true;
    this.fetch().then(() => {
      this.loader = false;
    });
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
