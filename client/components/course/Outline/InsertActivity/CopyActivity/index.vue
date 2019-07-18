<template>
  <v-dialog :value="true" width="700px" persistent>
    <v-card class="pa-3">
      <v-card-title class="headline">
        <v-avatar color="secondary" size="38" class="mr-2">
          <v-icon color="white">mdi-content-copy</v-icon>
        </v-avatar>
        Copy activity
      </v-card-title>
      <v-card-text class="content-section">
        <div v-if="showLoader" class="search-spinner">
          <v-progress-circular color="primary" indeterminate/>
        </div>
        <div v-else-if="selectedRepository">
          <v-layout justify-space-between>
            <v-select
              :value="selectedRepository"
              :items="repositories"
              @input="updateSelected"
              item-text="name"
              item-value="id"
              label="Repository"
              class="repo-dropdown"/>
            <v-text-field
              v-model="search"
              placeholder="Filter by name..."
              clearable
              clear-icon="mdi-close-circle-outline"/>
          </v-layout>
          <repository-tree
            :activities="selectedRepository.children"
            :search="search"
            :selected="selected"
            @toggleSelect="toggleSelect"/>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          :disabled="!selected"
          @click="$emit('copy', selected)"
          color="primary"
          outline>
          Copy
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import activityApi from 'client/api/activity';
import courseApi from 'client/api/course';
import get from 'lodash/get';
import Promise from 'bluebird';
import RepositoryTree from './RepositoryTree';
import sortBy from 'lodash/sortBy';

export default {
  props: {
    supportedLevels: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      showLoader: true,
      selected: null,
      repositories: [],
      selectedRepository: null,
      search: ''
    };
  },
  methods: {
    updateSelected(id) {
      if (id !== get(this.selectedRepository, 'id')) this.selected = null;
      const repo = this.repositories.find(it => it.id === id);
      if (repo.children) {
        this.selectedRepository = repo;
      } else {
        return this.fetchActivities(repo).then(repository => {
          this.selectedRepository = repository;
        });
      }
    },
    toggleSelect(item) {
      this.selected = item.id !== get(this.selected, 'id') ? item : null;
    },
    addChildren(children, activities) {
      return children.map(it => {
        it.name = it.data.name;
        it.supported = this.supportedLevels.find(({ type }) => type === it.type);
        const grandChildren = activities.filter(item => {
          return item.data.name && item.parentId === it.id;
        });
        if (!grandChildren.length) return it;
        it.children = this.addChildren(grandChildren, activities);
        return it;
      });
    },
    fetchActivities(repository) {
      if (repository.children) return repository;
      return activityApi.getActivities(repository.id).then(items => {
        let activities = sortBy(items, 'position');
        activities = this.addChildren(activities, activities);
        repository.children = activities.filter(it => it.parentId === null);
        return repository;
      });
    }
  },
  created() {
    return Promise.join(courseApi.getCourses(), Promise.delay(700), items => {
      this.repositories = sortBy(items, 'name');
      this.showLoader = false;
      return this.updateSelected(this.repositories[0].id);
    });
  },
  components: { RepositoryTree }
};
</script>

<style lang="scss" scoped>
.repo-dropdown.v-text-field {
  margin-right: 30px;
}
</style>
