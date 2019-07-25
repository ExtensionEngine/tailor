<template>
  <v-dialog :value="true" width="75vw" persistent>
    <v-card class="pa-3">
      <v-card-title class="headline">
        <v-avatar color="secondary" size="38" class="mr-2">
          <v-icon color="white">mdi-content-copy</v-icon>
        </v-avatar>
        Copy activity from {{ schemaName | pluralize }}
      </v-card-title>
      <v-card-text class="content-section">
        <div v-if="showLoader" class="search-spinner">
          <v-progress-circular color="primary" indeterminate/>
        </div>
        <div v-else-if="selectedRepository">
          <v-container grid-list-xl pa-0>
            <v-layout justify-space-between>
              <v-flex>
                <v-select
                  :value="selectedRepository"
                  :items="repositories"
                  :label="schemaName"
                  @input="updateSelected"
                  item-text="name"
                  item-value="id"/>
              </v-flex>
              <v-flex class="filter-activities">
                <v-text-field
                  v-model="search"
                  placeholder="Filter activities..."
                  clearable
                  clear-icon="mdi-close-circle-outline"/>
              </v-flex>
            </v-layout>
          </v-container>
          <repository-tree
            :activities="selectedRepository.children"
            :search="search"
            :selected="selected"
            :schemaName="schemaName"
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
import { mapGetters } from 'vuex';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import RepositoryTree from './RepositoryTree';
import { SCHEMAS } from 'shared/activities';
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
  computed: {
    ...mapGetters('course', ['course']),
    schemaName() {
      return SCHEMAS.find(it => it.id === this.course.schema).name;
    }
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
    const { schema } = this.course;
    return Promise.join(courseApi.getCourses(), Promise.delay(700), items => {
      this.repositories = sortBy(items, 'name').filter(it => it.schema === schema);
      this.showLoader = false;
      return this.updateSelected(this.repositories[0].id);
    });
  },
  filters: {
    pluralize(val) {
      return pluralize(val);
    }
  },
  components: { RepositoryTree }
};
</script>

<style lang="scss" scoped>
.filter-activities {
  max-width: 250px;
}
</style>
