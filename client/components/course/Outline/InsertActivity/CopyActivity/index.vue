<template>
  <v-dialog :value="true" width="65vw" persistent>
    <v-card class="pa-3">
      <v-card-title class="headline">
        <v-avatar color="secondary" size="38" class="mr-2">
          <v-icon color="white">mdi-content-copy</v-icon>
        </v-avatar>
        Copy items from {{ schema.name | pluralize }}
      </v-card-title>
      <v-card-text>
        <div v-if="showLoader" class="search-spinner">
          <v-progress-circular color="primary" indeterminate />
        </div>
        <div v-else-if="selectedRepository">
          <v-container class="py-3 pr-5 mx-0 input-section">
            <v-autocomplete
              @input="updateSelected"
              :value="selectedRepository"
              :items="repositories"
              :label="schema.name"
              prepend-inner-icon="mdi-magnify"
              item-text="name"
              item-value="id" />
            <v-text-field
              v-model="search"
              :placeholder="`Filter selected ${schema.name}...`"
              clearable
              prepend-inner-icon="mdi-filter-outline"
              clear-icon="mdi-close-circle-outline" />
          </v-container>
          <repository-tree
            @toggleSelect="toggleSelect"
            :activities="selectedRepository.children"
            :search="search"
            :selected="selected"
            :schema-name="schema.name" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="$emit('cancel')">Cancel</v-btn>
        <v-btn
          @click="$emit('copy', selected)"
          :disabled="!selected.length"
          color="primary"
          outlined>
          {{ copyButtonLabel }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import activityApi from 'client/api/activity';
import courseApi from 'client/api/course';
import get from 'lodash/get';
import keyBy from 'lodash/keyBy';
import { mapGetters } from 'vuex';
import pluralize from 'pluralize';
import Promise from 'bluebird';
import RepositoryTree from './RepositoryTree';
import { SCHEMAS } from 'shared/activities';
import sortBy from 'lodash/sortBy';

export default {
  props: {
    supportedLevels: { type: Array, default: () => ([]) },
    anchorType: { type: String, required: true }
  },
  data() {
    return {
      showLoader: true,
      selected: [],
      repositories: [],
      selectedRepository: null,
      search: ''
    };
  },
  computed: {
    ...mapGetters('course', ['course']),
    schema() {
      return SCHEMAS.find(it => it.id === this.course.schema);
    },
    structureTypes() {
      return keyBy(this.schema.structure, 'type');
    },
    copyButtonLabel() {
      const { selected, structureTypes, anchorType } = this;
      let label = 'Copy';
      if (!selected.length) return label;
      if (selected.length > 1) label = label.concat(` ${selected.length} items`);
      const itemLevel = structureTypes[selected[0].type].level;
      const anchorLevel = structureTypes[anchorType].level;
      return itemLevel > anchorLevel ? label.concat(' inside') : label;
    }
  },
  methods: {
    updateSelected(id) {
      if (id !== get(this.selectedRepository, 'id')) this.selected = [];
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
      if (this.selected.find(({ id }) => id === item.id)) {
        this.selected = this.selected.filter(({ id }) => id !== item.id);
      } else {
        this.selected.push(item);
      }
    },
    addChildren(children, activities) {
      const { supportedLevels, addChildren } = this;
      return children.map(it => {
        it.name = it.data.name;
        const supported = supportedLevels.find(({ type }) => type === it.type);
        if (supported) it.level = supported.level;
        const grandChildren = activities.filter(item => {
          return item.data.name && item.parentId === it.id;
        });
        if (!grandChildren.length) return it;
        it.children = addChildren(grandChildren, activities);
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
    },
    copy() {
      const orderedItems = sortBy(this.selected, ['parentId', 'position']);
      this.$emit('copy', orderedItems);
    }
  },
  created() {
    const { schema } = this.course;
    return Promise.join(courseApi.getRepositories(), Promise.delay(700), items => {
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
.input-section {
  max-width: 60%;
}

::v-deep .v-list-item__content {
  flex: initial;
}
</style>
