<template>
  <div infinite-wrapper class="catalog-wrapper">
    <v-container class="catalog">
      <v-layout row class="mb-4">
        <v-flex md6 sm10 offset-md3 offset-sm1>
          <search @change="search" class="pt-4"/>
        </v-flex>
        <v-flex md3 sm1>
          <create-repository class="pt-2"/>
        </v-flex>
      </v-layout>
      <v-layout v-show="!searching" row wrap>
        <v-flex
          v-for="repository in orderedRepositories"
          :key="repository._cid"
          xs4
          class="px-2 py-3">
          <repository-card :repository="repository"/>
        </v-flex>
      </v-layout>
      <v-progress-circular
        v-show="searching"
        color="primary"
        indeterminate
        class="search-spinner"/>
    </v-container>
    <infinite-loading ref="infiniteLoading" @infinite="loadMore">
      <div slot="spinner" class="spinner">
        <v-progress-circular color="primary" indeterminate/>
      </div>
      <div slot="no-results" class="no-results subheading">
        {{ orderedRepositories.length ? '' : 'No matches found' }}
      </div>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CreateRepository from './Create';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import isEmpty from 'lodash/isEmpty';
import orderBy from 'lodash/orderBy';
import Promise from 'bluebird';
import RepositoryCard from './Card';
import Search from './Search';

export default {
  data() {
    return { searching: false };
  },
  computed: {
    ...mapGetters(['courses']),
    ...mapGetters('courses', ['hasMoreResults']),
    orderedRepositories() {
      return orderBy(this.courses, 'updatedAt', 'desc');
    },
    loaderState() {
      return get(this.$refs, 'infiniteLoading.stateChanger', {});
    }
  },
  methods: {
    ...mapActions('courses', ['fetch']),
    ...mapMutations('courses', ['setSearch']),
    loadMore() {
      return this.fetch().then(() => {
        if (!isEmpty(this.courses)) this.loaderState.loaded();
        if (!this.hasMoreResults) this.loaderState.complete();
      });
    },
    load(query) {
      this.loaderState.loaded();
      this.loaderState.complete();
      return Promise.join(this.fetch({ reset: true }))
        .then(() => {
          this.loaderState.reset();
          if (!isEmpty(this.courses)) this.loaderState.loaded();
          if (!this.hasMoreResults) this.loaderState.complete();
        });
    },
    search(query) {
      this.setSearch(query);
      this.searching = true;
      return this.load().then(() => (this.searching = false));
    }
  },
  mounted() {
    this.search();
  },
  components: {
    CreateRepository,
    InfiniteLoading,
    RepositoryCard,
    Search
  }
};
</script>

<style lang="scss" scoped>
.catalog-wrapper {
  position: relative;
}

.catalog {
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    height: 230px;
    width: 100%;
    background: #455a64;
    box-shadow:
      0px 3px 5px -1px rgba(0,0,0,0.2),
      0px 5px 8px 0px rgba(0,0,0,0.14),
      0px 1px 14px 0px rgba(0,0,0,0.12);
  }
}

.search-spinner {
  margin-top: 170px;
}

.spinner, .no-results {
  margin-top: 120px;
}
</style>
