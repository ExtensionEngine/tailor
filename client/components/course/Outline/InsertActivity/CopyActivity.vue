<template>
  <modal :show="true">
    <div slot="header">
      <h3 class="modal-title">Copy Activity</h3>
    </div>
    <div slot="body" class="modal-body">
      <circular-progress v-if="showLoader"/>
      <v-treeview
        v-else
        :items="repositories"
        :transition="true"
        :load-children="fetchActivities"
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
    </div>
    <div slot="footer">
      <button
        @click="$emit('cancel')"
        class="btn btn-material btn-default"
        type="button">
        Cancel
      </button>
      <button
        :class="{ disabled: !selected }"
        @click="$emit('copy', selected)"
        class="btn btn-material btn-primary"
        type="button">
        Copy
      </button>
    </div>
  </modal>
</template>

<script>
import activityApi from 'client/api/activity';
import CircularProgress from 'components/common/CircularProgress';
import courseApi from 'client/api/course';
import get from 'lodash/get';
import Modal from 'components/common/Modal';
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
  },
  components: { CircularProgress, Modal }
};
</script>

<style lang="scss" scoped>
.disabled {
  pointer-events: none;
}

.select-btn {
  cursor: pointer;
}

.picked {
  color: #337ab7;
}
</style>
