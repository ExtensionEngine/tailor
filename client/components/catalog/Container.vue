<template>
  <div infinite-wrapper class="catalog-wrapper">
    <v-container :class="{ 'catalog-empty': !hasRepositories }" class="catalog mt-3">
      <v-row no-gutters class="catalog-actions">
        <add-repository @done="onRepositoryAdd" />
        <v-col md="4" sm="10" offset-md="4" offset-sm="1">
          <search
            @update="onFilterChange(setSearch, $event)"
            :value="queryParams.search" />
        </v-col>
        <v-col md="3" sm="1" class="text-sm-left pl-2">
          <v-tooltip open-delay="800" top>
            <template v-slot:activator="{ on }">
              <v-btn
                v-on="on"
                @click="onFilterChange(togglePinned)"
                :color="showPinned ? 'lime accent-3' : 'primary lighten-2'"
                icon
                class="my-1">
                <v-icon>mdi-pin</v-icon>
              </v-btn>
            </template>
            <span>{{ showPinned ? 'Show all' : 'Show pinned' }}</span>
          </v-tooltip>
          <select-order
            @update="onFilterChange(setOrder, $event)"
            :sort-by="sortBy"
            class="pl-2" />
          <repository-filter
            v-for="filter in filters"
            :key="filter.type"
            @update="onFilterChange(toggleRepositoryFilter, $event)"
            v-bind="filter" />
        </v-col>
      </v-row>
      <repository-filter-selection
        @close="onFilterChange(toggleRepositoryFilter, $event)"
        @clear:all="onFilterChange(clearRepositoryFilter, $event)" />
      <v-row data-testid="catalog__repositories">
        <v-col
          v-for="repository in repositories"
          :key="repository.uid"
          cols="4"
          class="px-2 pb-5">
          <repository-card :repository="repository" />
        </v-col>
      </v-row>
      <infinite-loading ref="loader" @infinite="load">
        <div slot="spinner" class="spinner">
          <v-progress-circular color="primary darken-2" indeterminate />
        </div>
        <div slot="no-results" class="no-results subheading">
          <v-alert
            :value="!loading"
            color="primary lighten-4"
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
import AddRepository from './Add';
import filterConfigs from './repositoryFilterConfigs';
import find from 'lodash/find';
import get from 'lodash/get';
import InfiniteLoading from 'vue-infinite-loading';
import { loader } from '@tailor-cms/core-components';
import map from 'lodash/map';
import RepositoryCard from './Card';
import RepositoryFilter from './RepositoryFilter';
import RepositoryFilterSelection from './RepositoryFilterSelection';
import { SCHEMAS } from '@tailor-cms/config';
import Search from './Search';
import SelectOrder from './SelectOrder';

export default {
  name: 'catalog-container',
  data: () => ({ loading: true }),
  computed: {
    ...mapState('repositories', {
      sortBy: state => state.$internals.sort,
      repositoryFilter: 'repositoryFilter',
      tags: 'tags',
      showPinned: 'showPinned'
    }),
    ...mapGetters('repositories', {
      repositories: 'repositories',
      queryParams: 'repositoryQueryParams',
      hasMoreResults: 'hasMoreResults'
    }),
    filters: ({ tags, repositoryFilter }) => {
      const { SCHEMA, TAG } = filterConfigs;
      const filters = [{ ...TAG, values: tags }];
      if (SCHEMAS.length > 1) filters.push({ ...SCHEMA, values: SCHEMAS });

      return map(filters, ({ type, values, ...config }) => {
        values = map(values, it => {
          const isSelected = !!find(repositoryFilter, { type, id: it.id });
          return { ...it, type, isSelected };
        });

        return { type, values, ...config };
      });
    },
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
    ...mapActions('repositories', ['fetch', 'fetchTags']),
    ...mapMutations('repositories', [
      'togglePinned', 'setSearch', 'setOrder', 'reset', 'resetFilters',
      'resetPagination', 'toggleRepositoryFilter', 'clearRepositoryFilter'
    ]),
    load: loader(async function () {
      await this.fetch();
      if (this.hasRepositories) this.loader.loaded();
      if (!this.hasMoreResults) this.loader.complete();
    }, 'loading'),
    async onRepositoryAdd() {
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
    // repositories must be reloaded for publishing badge to work properly
    // reset state manually to trigger "infinite" event in all cases
    this.resetPagination();
    this.reset();
    this.fetchTags();
  },
  components: {
    AddRepository,
    InfiniteLoading,
    RepositoryCard,
    RepositoryFilter,
    RepositoryFilterSelection,
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
    background: #37474f;
    box-shadow:
      0 3px 1px -2px rgba(0,0,0,0.2),
      0 2px 2px 0 rgba(0,0,0,0.14),
      0 1px 5px 0 rgba(0,0,0,0.12);
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
  padding-top: 12px;

  ::v-deep .add-repo {
    top: 10px;
    right: 12px;
  }
}
</style>
