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
import debounce from 'lodash/debounce';
import find from 'lodash/find';
import loader from '@/components/common/loader';
import repositoryApi from '@/api/repository';

const SEARCH_MIN_LENGTH = 3;

export default {
  name: 'select-repository',
  props: {
    repository: { type: Object, default: null }
  },
  data: () => ({
    repositories: [],
    loading: false
  }),
  methods: {
    select(repository) {
      if (find(this.repositories, { id: repository.id })) {
        this.$emit('selected', repository);
      }
    },
    fetchRepositories: debounce(loader(function (search) {
      if (!search || search.length < SEARCH_MIN_LENGTH) {
        return (this.repositories = []);
      }
      return repositoryApi.getRepositories({ search })
        .then(repositories => (this.repositories = repositories));
    }, 'loading'), 500)
  }
};
</script>
