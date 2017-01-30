<template>
  <div class="row course-list">
    <cube-spinner v-if="showLoader"></cube-spinner>
    <div
      v-else
      v-for="course in courses"
      :key="course._cid"
      class="col-lg-4">
      <card :course="course"></card>
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
      if (!this.showLoader && this.hasMoreResults) {
        this.paginate = true;
        this.fetch().then(() => {
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
    showLoader: {
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
