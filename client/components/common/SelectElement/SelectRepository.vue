<template>
  <v-combobox
    @input="select"
    @update:search-input="fetchRepositories"
    :value="repository"
    :items="repositories"
    :loading="loading"
    v-bind="$attrs"
    item-value="id"
    item-text="name"
    label="Select repository"
    placeholder="Type to search repositories..."
    outlined return-object
    class="mx-3" />
</template>

<script>
import loader from '@/components/common/loader';
import repositoryApi from '@/api/repository';
import throttle from 'lodash/throttle';
import uniqBy from 'lodash/uniqBy';

const SEARCH_MIN_LENGTH = 3;

export default {
  name: 'select-repository',
  props: {
    repository: { type: Object, default: null }
  },
  data: vm => ({
    repositories: [],
    loading: false
  }),
  methods: {
    select(repository) {
      if (this.repositories.includes(repository)) {
        this.$emit('selected', repository);
      }
    },
    fetchRepositories: throttle(loader(function (search) {
      if (!search || search.length < SEARCH_MIN_LENGTH) return;
      return repositoryApi.getRepositories({ search }).then(repos => {
        this.repositories = uniqBy([...this.repositories, ...repos], 'id');
      });
    }, 'loading'), 500)
  }
};
</script>
