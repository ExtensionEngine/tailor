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
      </infinite-loading>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import InfiniteLoading from 'vue-infinite-loading';
import Card from './Card';
import CubeSpinner from '../loaders/CubeSpinner';

export default {
  name: 'course-list',
  data() {
    return {
      loader: true,
      loaderPaginate: false
    };
  },
  computed: mapGetters(['courses']),
  methods: {
    ...mapActions(['fetch', 'fetchNextPage'], 'courses'),
    onInfinite() {
      this.loaderPaginate = true;

      // TODO(marko): trigger is very sensitive without setTimeout?
      setTimeout(() => {
        this.fetchNextPage().then(() => {
          this.loaderPaginate = false;
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
        });
      }, 1000);
    }
  },
  created() {
    this.loader = true;
    this.fetch().then(() => {
      this.loader = false;
    });
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
