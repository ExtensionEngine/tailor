<template>
  <div>
    <div v-if="!hasMoreResults && revisions.length === 0" class="well">
      No changes recorded.
    </div>
    <div v-if="revisions.length > 0" class="revisions">
      <div class="subheader">History</div>
      <ul>
        <revision-item
          v-for="revision in revisions"
          :key="revision._cid"
          :revision="revision">
        </revision-item>
      </ul>
    </div>
    <loader v-show="showLoader" class="loader"></loader>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="showLoader"
      infinite-scroll-distance="100">
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../../common/Loader';
import RevisionItem from './RevisionItem';

export default {
  name: 'course-revisions',
  data() {
    return { showLoader: false };
  },
  computed: {
    ...mapGetters(['revisions'], 'course'),
    ...mapGetters(['hasMoreResults'], 'revisions')
  },
  methods: {
    ...mapActions(['fetch', 'resetPagination'], 'revisions'),
    ...mapMutations(['setBaseUrl'], 'revisions'),
    loadMore() {
      if (!this.hasMoreResults) return;
      this.showLoader = true;
      this.fetch().then(() => (this.showLoader = false));
    }
  },
  mounted() {
    const courseId = Number(this.$route.params.courseId);
    this.setBaseUrl(`/courses/${courseId}/revisions`);
    this.resetPagination();
  },
  components: { Loader, RevisionItem },
  directives: {
    InfiniteScroll
  }
};
</script>

<style lang="scss" scoped>
.well {
  margin: 40px;
  font-size: 16px;
}

.loader {
  margin-top: 32px;
}

.revisions {
  margin: 60px 60px 0;
  padding: 30px;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
  font-family: Roboto, sans-serif;

  ul {
    padding: 8px 0;
    list-style-type: none;

    li {
      width: 100%;
    }
  }

  .subheader {
    display: inline-block;
    height: 48px;
    margin-left: 56px;
    padding: 0 16px;
    color: #808080;
    line-height: 48px;
  }
}
</style>
