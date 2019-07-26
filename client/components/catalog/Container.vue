<template>
  <div infinite-wrapper class="catalog-wrapper">
    <v-container :class="{ 'catalog-empty': !hasRepositories }" class="catalog">
      <v-layout row class="catalog-actions">
        <create-repository />
        <v-flex md4 sm10 offset-md4 offset-sm1>
          <search @update="setSearch($event)" :value="queryParams.search" />
        </v-flex>
        <v-flex md3 sm1 class="text-sm-left pl-2">
          <v-tooltip open-delay="800" right>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="togglePinned()" icon flat>
                <v-icon :color="showPinned ? 'lime accent-3' : 'primary lighten-4'">
                  mdi-pin
                </v-icon>
              </v-btn>
            </template>
            <span>Toggle pinned</span>
          </v-tooltip>
          <select-order @update="setOrder" :sort-by="sortBy" class="pl-2" />
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex
          v-for="repository in repositories"
          :key="repository._cid"
          xs4
          class="px-2 py-3">
          <repository-card :repository="repository" />
        </v-flex>
      </v-layout>
      <infinite-loading ref="loader" @infinite="load">
        <div slot="spinner" class="spinner">
          <v-progress-circular color="primary" indeterminate />
        </div>
        <div slot="no-results" class="no-results subheading">
          <v-alert
            :value="!loading"
            color="blue-grey lighten-4"
            icon="mdi-cloud-search-outline"
            outline>
            {{ noRepositoriesMessage }}
          </v-alert>
        </div>
        <span slot="no-more"></span>
      </infinite-loading>
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import CreateRepository from './Create';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';
import RepositoryCard from './Card';
import Search from './Search';
import SelectOrder from './SelectOrder';

export default {
  data() {
    return {
      loading: true
    };
  },
  computed: {
    ...mapState('courses', {
      sortBy: state => state.$internals.sort,
      showPinned: 'showPinned'
    }),
    ...mapGetters('courses', {
      repositories: 'courses',
      queryParams: 'courseQueryParams',
      hasMoreResults: 'hasMoreResults'
    }),
    loader() {
      return get(this.$refs, 'loader.stateChanger', {});
    },
    hasRepositories() {
      return !!this.repositories.length;
    },
    noRepositoriesMessage() {
      if (this.loading) return;
      if (this.hasRepositories) return;
      if (this.queryParams.search) return 'No matches found';
      if (this.showPinned) return '0 pinned items';
      return '0 available repositories';
    }
  },
  methods: {
    ...mapActions('courses', ['fetch']),
    ...mapMutations('courses', ['togglePinned', 'setSearch', 'setOrder']),
    load() {
      this.loading = true;
      return this.fetch().then(() => {
        if (this.hasRepositories) this.loader.loaded();
        if (!this.hasMoreResults) this.loader.complete();
        this.loading = false;
      });
    },
    open({ id }, name = 'course') {
      const params = { courseId: id };
      this.$router.push({ name, params });
    }
  },
  watch: {
    repositories() {
      // If all items get unpinned
      if (!this.hasRepositories && this.showPinned) this.loader.reset();
    },
    queryParams(val, oldVal) {
      const attrs = ['search', 'sortOrder', 'sortBy', 'pinned'];
      const changedFilter = !isEqual(pick(val, attrs), pick(oldVal, attrs));
      if (!changedFilter) return;
      this.load().then(() => this.loader.reset());
    }
  },
  components: {
    CreateRepository,
    InfiniteLoading,
    RepositoryCard,
    Search,
    SelectOrder
  }
};
</script>

<style lang="scss" scoped>
.catalog-wrapper {
  position: relative;
}

.catalog {
  @media (min-width: 1440px) {
    max-width: 1185px !important;
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 230px;
    background: #455a64;
    box-shadow:
      0 3px 5px -1px rgba(0,0,0,0.2),
      0 5px 8px 0 rgba(0,0,0,0.14),
      0 1px 14px 0 rgba(0,0,0,0.12);
  }

  &.catalog-empty {
    &::before {
      width: 100%;
      height: 100%;
    }
  }
}

.spinner, .no-results {
  margin-top: 40px;
}

.catalog-actions {
  position: relative;
  margin-bottom: 20px;
  padding-top: 12px;

  /deep/ .add-repo {
    top: 10px;
    right: 12px;
  }
}
</style>
