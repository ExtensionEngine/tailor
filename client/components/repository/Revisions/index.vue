<template>
  <div>
    <div v-if="revisions.length > 0" class="revisions">
      <ul>
        <revision-item
          v-for="revision in bundledRevisions"
          :key="revision.uid"
          :revision="revision" />
      </ul>
    </div>
    <infinite-loading @infinite="fetchRevisions">
      <span slot="spinner">
        <div class="col-lg-12 loader-wrapper">
          <v-progress-circular color="primary darken-2" indeterminate />
        </div>
      </span>
      <span slot="no-results">No changes recorded.</span>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import { isSameInstance } from 'utils/revision';
import last from 'lodash/last';
import reduce from 'lodash/reduce';
import RevisionItem from './RevisionItem';

export default {
  name: 'repository-revisions',
  data() {
    return {
      bundledRevisionCount: 0
    };
  },
  computed: {
    ...mapGetters('repository/revisions', {
      revisions: 'items',
      hasMoreResults: 'hasMoreResults'
    }),
    bundledRevisions() {
      return reduce(this.revisions, (acc, it) => {
        const prevRevision = last(acc);
        const isSameOperation = prevRevision.operation === it.operation;
        if (!isSameInstance(prevRevision, it) || !isSameOperation) acc.push(it);
        return acc;
      }, [this.revisions[0]]);
    }
  },
  methods: {
    ...mapActions('repository/revisions', ['fetch', 'resetPagination']),
    fetchRevisions($state) {
      this.fetch().then(() => {
        const diff = this.bundledRevisions.length - this.bundledRevisionCount;
        this.bundledRevisionCount += diff;
        if (diff < 10 && this.hasMoreResults) {
          this.fetchRevisions($state);
        } else {
          $state.loaded();
        }
        if (!this.hasMoreResults) $state.complete();
      });
    }
  },
  mounted() {
    this.resetPagination();
  },
  components: { InfiniteLoading, RevisionItem }
};
</script>

<style lang="scss" scoped>
.loader-wrapper {
  margin: 7.5rem 0;
}

.revisions {
  padding: 1rem 0.75rem 1.875rem;
  text-align: left;

  ul {
    max-width: 75rem;
    padding: 0.5rem 0;
    list-style-type: none;

    li {
      width: 100%;
    }
  }
}
</style>
