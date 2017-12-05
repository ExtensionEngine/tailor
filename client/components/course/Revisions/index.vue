<template>
  <div>
    <div v-if="revisions.length > 0" class="revisions">
      <ul>
        <revision-item
          v-for="revision in bundledRevisions"
          :key="revision._cid"
          :revision="revision">
        </revision-item>
      </ul>
    </div>
    <infinite-loading @infinite="fetchRevisions">
      <span slot="spinner">
        <div class="col-lg-12 loader-wrapper">
          <circular-progress></circular-progress>
        </div>
      </span>
      <span slot="no-results">No changes recorded.</span>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex-module';
import CircularProgress from 'components/common/CircularProgress';
import InfiniteLoading from 'vue-infinite-loading';
import last from 'lodash/last';
import reduce from 'lodash/reduce';
import RevisionItem from './RevisionItem';

export default {
  name: 'course-revisions',
  computed: {
    ...mapGetters(['revisions'], 'course'),
    ...mapGetters(['hasMoreResults'], 'revisions'),
    bundledRevisions() {
      return reduce(this.revisions, (bundle, rev) => {
        const lastRev = last(bundle);
        if (lastRev.operation === rev.operation &&
            lastRev.state.id === rev.state.id) return bundle;

        bundle.push(rev);
        return bundle;
      }, [this.revisions[0]]);
    }
  },
  methods: {
    ...mapActions(['fetch', 'resetPagination'], 'revisions'),
    fetchRevisions($state) {
      return this.fetch().then(() => {
        $state.loaded();
        if (!this.hasMoreResults) $state.complete();
      });
    }
  },
  mounted() {
    this.resetPagination();
  },
  components: { CircularProgress, InfiniteLoading, RevisionItem }
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  margin: 50px 0;
}

.revisions {
  margin: 60px 60px 0;
  padding: 30px;
  font-family: Roboto, sans-serif;
  text-align: left;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);

  ul {
    padding: 8px 0;
    list-style-type: none;

    li {
      width: 100%;
    }
  }
}
</style>
