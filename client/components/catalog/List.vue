<template>
  <div class="row course-list">
    <cube-spinner v-if="loader"></cube-spinner>
    <div v-else v-for="course in courses" class="col-lg-4">
      <card
        :id="course._cid"
        :name="course.name"
        :description="course.description">
      </card>
    </div>

    <div class="col-lg-12 loader-wrapper">
      <cube-spinner v-show="paginate"></cube-spinner>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="paginate"
        infinite-scroll-distance="100">
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import InfiniteScroll from 'vue-infinite-scroll';
import Card from './Card';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-list',
  data() {
    return {
      paginate: false
    };
  },
  computed: mapGetters(['hasMoreResults'], 'courses'),
  methods: {
    ...mapActions(['fetch'], 'courses'),
    loadMore() {
      if (!this.loader && this.hasMoreResults) {
        this.paginate = true;
        this.fetch(this.paginate).then(() => {
          this.paginate = false;
        });
      }
    }
  },
  props: {
    courses: {
      type: Object,
      required: true
    },
    loader: {
      type: Boolean,
      required: true
    }
  },
  components: {
    Card,
    CubeSpinner
  },
  directives: {
    InfiniteScroll
  }
};
</script>

<style lang="scss">
.loader-wrapper {
  height: 80px;

  .spinner {
    margin: 60px auto;
  }
}
</style>
