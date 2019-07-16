<template>
  <modal :show="show">
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
          <v-icon v-if="item.children" :color="item.data.color">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ 'mdi-file-document-box' }}
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
        @click="closeModal"
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
      repositories: [],
      selected: null,
      show: true
    };
  },
  methods: {
    isPicked({ id }) {
      return get(this.selected, 'id') === id;
    },
    closeModal() {
      this.show = false;
      this.$emit('cancel');
    },
    toggleSelect(item) {
      this.selected = item.id !== get(this.selected, 'id') ? item : null;
    },
    appendChildren(children, activities) {
      return children.map(it => {
        it.name = it.data.name;
        it.supported = this.supportedLevels.find(({ type }) => type === it.type);
        it.children = this.getChildren(it.id, activities);
        return it;
      });
    },
    getChildren(id, activities) {
      const children = activities.filter(it => it.parentId === id);
      if (!children.length) return;
      const withChildren = this.appendChildren(children, activities);
      return withChildren;
    },
    fetchActivities(repository) {
      return activityApi.getActivities(repository.id).then(items => {
        let activities = sortBy(items, 'position');
        activities = this.appendChildren(activities, activities);
        repository.children = activities.filter(it => it.parentId === null);
        return repository;
      });
    }
  },
  created() {
    return Promise.join(courseApi.getCourses(), Promise.delay(700), items => {
      const repositories = items.map(it => {
        it.children = [];
        return it;
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
