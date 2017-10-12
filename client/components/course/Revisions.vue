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
    <loader v-show="paginate" class="loader"></loader>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="paginate"
      infinite-scroll-distance="100">
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import InfiniteScroll from 'vue-infinite-scroll';
import Loader from '../common/Loader';
import Promise from 'bluebird';
import RevisionItem from './RevisionItem';

export default {
  name: 'course-revisions',
  data() {
    return {
      paginate: false
    };
  },
  computed: {
    ...mapGetters(['revisions'], 'course'),
    ...mapGetters(['hasMoreResults'], 'revisions')
  },
  methods: {
    ...mapActions(['fetch'], 'revisions'),
    ...mapMutations(['setBaseUrl', 'resetPagination'], 'revisions'),
    fetchRevisions() {
      this.resetPagination();
      return Promise.join(this.fetch(), Promise.delay(400));
    },
    loadMore() {
      if (this.hasMoreResults) {
        this.paginate = true;
        this.fetch().then(() => {
          this.paginate = false;
        });
      }
    }
  },
  mounted() {
    const courseId = Number(this.$route.params.courseId);
    this.setBaseUrl(`/courses/${courseId}/revisions`);
    this.fetchRevisions();
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
  margin: 60px 60px 0 60px;
  padding: 30px;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);

  ul {
    padding: 8px 0;
    list-style-type: none;
    font-family: Roboto, sans-serif;

    li {
      width: 100%;
    }
  }

  .subheader {
    height: 48px;
    display: inline-block;
    margin-left: 56px;
    padding: 0 16px;
    line-height: 48px;
    color: #808080;
  }
}
</style>
