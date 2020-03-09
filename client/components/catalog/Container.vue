<template>
  <div infinite-wrapper class="catalog-wrapper">
    <v-container :class="{ 'catalog-empty': !hasRepositories }" class="catalog mt-3">
      <v-row no-gutters class="catalog-actions">
        <create-repository @created="onCreate" />
        <v-col md="4" sm="10" offset-md="4" offset-sm="1">
          <search
            @update="onFilterChange(setSearch, $event)"
            :value="queryParams.search" />
        </v-col>
        <v-col md="3" sm="1" class="text-sm-left pl-2">
          <v-tooltip open-delay="800" right>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="onFilterChange(togglePinned)"
                icon text
                class="my-1">
                <v-icon :color="showPinned ? 'lime accent-3' : 'primary lighten-4'">
                  mdi-pin
                </v-icon>
              </v-btn>
            </template>
            <span>Toggle pinned</span>
          </v-tooltip>
          <select-order
            @update="onFilterChange(setOrder, $event)"
            :sort-by="sortBy"
            class="pl-2" />
        </v-col>
      </v-row>
      <v-row>
        <v-col
          v-for="repository in repositories"
          :key="repository._cid"
          cols="4"
          class="px-2 py-3">
          <repository-card :repository="repository" />
        </v-col>
      </v-row>
      <infinite-loading ref="loader" @infinite="load">
        <div slot="spinner" class="spinner">
          <v-progress-circular color="primary" indeterminate />
        </div>
        <div slot="no-results" class="no-results subheading">
          <v-alert
            :value="!loading"
            color="blue-grey lighten-4"
            icon="mdi-cloud-search-outline"
            outlined>
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
    ...mapState('repositories', {
      sortBy: state => state.$internals.sort,
      showPinned: 'showPinned'
    }),
    ...mapGetters('repositories', {
      repositories: 'repositories',
      queryParams: 'repositoryQueryParams',
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
    ...mapActions('repositories', ['fetch']),
    ...mapMutations('repositories', [
      'togglePinned', 'setSearch', 'setOrder',
      'reset', 'resetFilters', 'resetPagination'
    ]),
    async load() {
      this.loading = true;
      await this.fetch();
      if (this.hasRepositories) this.loader.loaded();
      if (!this.hasMoreResults) this.loader.complete();
      this.loading = false;
    },
    async onCreate() {
      this.setOrder({ field: 'createdAt', order: 'DESC' });
      this.resetFilters();
      await this.load();
      this.loader.reset();
    },
    async onFilterChange(filter, val) {
      filter(val);
      await this.load();
      await this.loader.reset();
    }
  },
  watch: {
    repositories() {
      // If all items get unpinned
      if (!this.hasRepositories && this.showPinned) this.loader.reset();
    }
  },
  created() {
    this.resetPagination();
    this.reset();
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
  @media (min-width: 1264px) {
    max-width: 1185px;
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

  ::v-deep .add-repo {
    top: 10px;
    right: 12px;
  }
}
</style>
