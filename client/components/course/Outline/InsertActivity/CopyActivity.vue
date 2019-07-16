<template>
  <v-dialog :value="true" width="600px" persistent>
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
        <v-treeview
          v-else
          :items="repositories"
          :transition="true"
          :load-children="fetchActivities"
          loading-icon="mdi-loading"
          class="pt-3">
          <template v-slot:prepend="{ item, open }">
            <v-icon :color="item.data.color">
              {{ getIcon(item.children, open) }}
            </v-icon>
          </template>
          <template v-slot:append="{ item }">
            <div
              v-if="item.supported"
              :class="{ picked: isPicked(item) }"
              @click="toggleSelect(item)"
              class="select-btn">
              {{ isPicked(item) ? 'Deselect' : 'Select' }}
            </div>
          </template>
        </v-treeview>
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
import sortBy from 'lodash/sortBy';

export default {
  props: {
    supportedLevels: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      showLoader: true,
      selected: null,
      repositories: []
    };
  },
  methods: {
    getIcon(children, open) {
      if (!children) return 'mdi-file-document-box';
      return open ? 'mdi-folder-open' : 'mdi-folder';
    },
    isPicked({ id }) {
      return get(this.selected, 'id') === id;
    },
    toggleSelect(item) {
      this.selected = item.id !== get(this.selected, 'id') ? item : null;
    },
    addChildren(children, activities) {
      return children.map(it => {
        it.name = it.data.name;
        it.supported = this.supportedLevels.find(({ type }) => type === it.type);
        const grandChildren = activities.filter(item => item.parentId === it.id);
        if (!grandChildren.length) return it;
        it.children = this.addChildren(grandChildren, activities);
        return it;
      });
    },
    fetchActivities(repository) {
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
      const repositories = items.map(repository => {
        repository.children = [];
        return repository;
      });
      this.repositories = sortBy(repositories, 'name');
      this.showLoader = false;
    });
  }
};
</script>

<style lang="scss" scoped>
.select-btn {
  cursor: pointer;

  &.picked {
    color: #337ab7;
  }
}

.content-section {
  max-height: 400px;
  margin: 20px auto 40px;
  user-select: none;
  overflow-y: scroll;

  :not(.search-spinner) {
    text-align: left;
  }
}
</style>
