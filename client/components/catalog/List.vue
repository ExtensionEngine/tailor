<template>
  <div class="row course-list">
    <loader v-if="showLoader"></loader>
    <card
      v-else
      v-for="course in orderedCourses"
      :key="course._cid"
      :course="course">
    </card>
    <div class="col-lg-12 loader-wrapper">
      <loader v-show="paginate"></loader>
      <div
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="paginate"
        infinite-scroll-distance="100">
      </div>
    </div>
  </div>
</template>

<script>
import Card from './Card';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../common/Loader';
import { mapActions, mapGetters } from 'vuex-module';
import orderBy from 'lodash/orderBy';

export default {
  name: 'course-list',
  data() {
    return {
      paginate: false
    };
  },
  computed: {
    ...mapGetters(['hasMoreResults'], 'courses'),
    orderedCourses() {
      return orderBy(this.courses, 'updatedAt', 'desc');
    }
  },
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
    Loader
  },
  directives: {
    InfiniteScroll
  }
};
</script>

<style lang="scss" scoped>
.loader {
  margin-top: 150px;
}
</style>
