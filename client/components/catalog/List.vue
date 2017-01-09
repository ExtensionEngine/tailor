<template>
  <div class="row course-list">
    <cube-spinner v-if="loader"></cube-spinner>
    <div v-else  v-for="course in courses" class="col-lg-4">
      <card
        :id="course._cid"
        :name="course.name"
        :description="course.description">
      </card>
    </div>

    <div class="col-lg-12 loader-wrapper">
      <infinite-loading
        :on-infinite="onInfinite"
        :distance="60"
        ref="infiniteLoading"
      >
        <div slot="spinner">
          <cube-spinner></cube-spinner>
        </div>
        <div slot="no-more"></div>
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import InfiniteLoading from 'vue-infinite-loading';
import Card from './Card';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-list',
  computed: mapGetters(['noMoreResults'], 'courses'),
  methods: {
    ...mapActions(['fetch'], 'courses'),
    ...mapMutations(['setPage'], 'courses'),
    onInfinite() {
      this.setPage();
      this.fetch(true).then(
        () => {
          if (this.noMoreResults) {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          } else {
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
          }
        });
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
    CubeSpinner,
    InfiniteLoading
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
