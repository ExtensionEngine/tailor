<template>
  <div>
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
    <infinite-loading @infinite="fetchRevisions">
      <span slot="spinner">
        <div class="col-lg-12 loader-wrapper"><loader></loader></div>
      </span>
      <span slot="no-results">No changes recorded.</span>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex-module';
import InfiniteLoading from 'vue-infinite-loading';
import Loader from '../../common/Loader';
import RevisionItem from './RevisionItem';

export default {
  name: 'course-revisions',
  computed: {
    ...mapGetters(['revisions'], 'course'),
    ...mapGetters(['hasMoreResults'], 'revisions')
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
  components: { InfiniteLoading, Loader, RevisionItem }
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
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
