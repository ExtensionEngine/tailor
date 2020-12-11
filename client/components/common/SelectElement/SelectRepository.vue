<template>
  <div>
    <v-text-field
      v-model="search"
      @input="searchRepositories"
      placeholder="Search repositories..."
      prepend-inner-icon="mdi-filter-outline"
      clear-icon="mdi-close-circle-outline"
      clearable outlined />
    <ul class="repository-list px-5">
      <v-hover
        v-for="repository in repositories"
        :key="repository.uid"
        v-slot:default="{ hover: isHovered }">
        <v-card
          @click="$emit('selected', repository)"
          :elevation="isHovered ? 10 : 1"
          color="blue-grey darken-4"
          tag="li"
          dark
          class="repository-item my-3 pl-1">
          <div
            :style="{ background: repository.data.color }"
            :class="['marker', { hovered: isHovered }]">
          </div>
          <div class="repository-info pa-1">
            <div class="schema-name ml-2">{{ getSchema(repository) }}</div>
            <v-card-title class="pt-2 blue-grey--text text--lighten-4 text-break">
              {{ repository.name }}
            </v-card-title>
          </div>
          <v-avatar color="blue-grey darken-3 mr-3">
            <v-icon
              color="grey lighten-3"
              :large="!isHovered"
              :x-large="isHovered">
              mdi-arrow-right-circle-outline
            </v-icon>
          </v-avatar>
        </v-card>
      </v-hover>
    </ul>
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
          {{ noResultsMessage }}
        </v-alert>
      </div>
      <span slot="no-more"></span>
    </infinite-loading>
  </div>
</template>

<script>
import get from 'lodash/get';
import { getSchema } from 'shared/activities';
import InfiniteLoading from 'vue-infinite-loading';
import loader from '@/components/common/loader';
import repositoryApi from '@/api/repository';
import throttle from 'lodash/throttle';

const PAGINATION_DEFAULTS = { offset: 0, limit: 15 };

export default {
  name: 'select-repository',
  data: () => ({
    repositories: [],
    search: null,
    loading: true,
    pagination: { ...PAGINATION_DEFAULTS },
    allRepositoriesFetched: false
  }),
  computed: {
    loader: vm => get(vm.$refs, 'loader.stateChanger', {}),
    noResultsMessage() {
      return this.search ? 'No matches found' : 'No available repositories';
    }
  },
  methods: {
    getSchema({ schema }) {
      return getSchema(schema).name;
    },
    load: throttle(loader(async function () {
      await this.fetchRepositories();
      if (this.repositories.length) this.loader.loaded();
      if (this.allRepositoriesFetched) this.loader.complete();
    }, 'loading'), 500),
    fetchRepositories() {
      const { search, pagination } = this;
      return repositoryApi.getRepositories({ search, ...pagination })
        .then(this.addRepositories);
    },
    addRepositories(repositories) {
      const { limit, offset } = this.pagination;
      this.repositories = offset === 0
        ? repositories
        : this.repositories.concat(repositories);
      this.allRepositoriesFetched = repositories.length < limit;
      this.pagination.offset += limit;
    },
    async searchRepositories(value) {
      this.pagination = { ...PAGINATION_DEFAULTS };
      await this.loader.reset();
      return this.load();
    }
  },
  components: { InfiniteLoading }
};
</script>

<style lang="scss" scoped>
.repository-item {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  position: relative;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(0.2rem);
  }

  .marker {
    display: block;
    position: absolute;
    left: 0;
    width: 0.4rem;
    height: 100%;
    transition: width 0.1s;
    border-bottom-left-radius: inherit;
    border-top-right-radius: 0 !important;

    &.hovered {
      width: 0.5rem;
    }
  }

  .v-avatar {
    border-radius: 50% !important;
  }
}

.repository-info {
  text-align: left;
  overflow: hidden;
}

.schema-name {
  color: #fafafa;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}
</style>
