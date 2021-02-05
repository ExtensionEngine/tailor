<template>
  <v-combobox
    @input="selectRepository"
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
import loader from '@/components/common/loader';
import repositoryApi from '@/api/repository';
import sortBy from 'lodash/sortBy';

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
    selectRepository(repository) {
      if (find(this.repositories, { id: repository.id })) {
        this.$emit('selected', repository);
      }
    },
    fetchRepositories: debounce(loader(function (search) {
      return repositoryApi.getRepositories({ search }).then(repositories => {
        this.repositories = sortBy(repositories, 'name');
      });
    }, 'loading'), 500)
  },
  created() {
    this.fetchRepositories();
  }
};
</script>
