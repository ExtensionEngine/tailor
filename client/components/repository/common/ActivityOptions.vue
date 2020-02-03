<template>
  <div>
    <v-menu max-width="350" offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="primary darken-1" icon tile>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="text-left text-uppercase">
        <v-list-item
          v-for="it in menuOptions"
          :key="it.name"
          @click="it.action()"
          dense>
          <v-list-item-title>
            <v-icon size="20" class="pr-1">mdi-{{ it.icon }}</v-icon>
            {{ it.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <create-dialog
      v-if="showCreateDialog"
      @close="showCreateDialog = null"
      @created="expandParent"
      :repository-id="activity.repositoryId"
      :levels="supportedLevels"
      :anchor="activity"
      :heading="`
        Add ${supportedLevels === subLevels ? 'into' : 'after'}
        ${activity.data.name}`" />
    <copy-dialog
      v-if="showCopyDialog"
      @close="showCopyDialog = null"
      @completed="parentId => expandParent({ parentId })"
      :repository-id="activity.repositoryId"
      :levels="supportedLevels"
      :anchor="activity" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CopyDialog from '../Outline/InsertActivity/CopyActivity';
import CreateDialog from '../Outline/InsertActivity/CreateDialog';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

const appChannel = EventBus.channel('app');
const TREE_VIEW_ROUTE = 'tree-view';

export default {
  name: 'activity-options',
  props: {
    activity: { type: Object, required: true }
  },
  data: () => ({
    showCreateDialog: false,
    showCopyDialog: false,
    supportedLevels: []
  }),
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters('repository', ['structure']),
    parent: vm => find(vm.activities, { id: vm.activity.parentId }),
    levels: vm => vm.sameLevel.concat(vm.subLevels),
    sameLevel() {
      const sameLevelTypes = this.parent
        ? get(find(this.structure, { type: this.parent.type }), 'subLevels', [])
        : map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.structure, it => sameLevelTypes.includes(it.type));
    },
    subLevels() {
      const { subLevels = [] } = find(this.structure, { type: this.activity.type });
      return filter(this.structure, it => subLevels.includes(it.type));
    },
    addMenuOptions() {
      const items = [{
        name: 'Add item below',
        icon: 'arrow-down',
        action: () => this.setCreateContext(this.sameLevel)
      }, {
        name: 'Add item into',
        icon: 'subdirectory-arrow-right',
        action: () => this.setCreateContext(this.subLevels)
      }];
      if (!this.subLevels.length) items.pop();
      return items;
    },
    menuOptions() {
      return [...this.addMenuOptions, {
        name: 'Copy existing',
        icon: 'content-copy',
        action: () => this.setCopyContext()
      }, {
        name: 'Remove',
        icon: 'delete',
        action: () => this.delete(this.activity)
      }];
    }
  },
  methods: {
    ...mapActions('activities', ['remove']),
    ...mapMutations('repository', ['focusActivity', 'toggleActivity']),
    expandParent(item) {
      const { activity, parent } = this;
      const _cid = item.parentId === activity.id
        ? activity._cid
        : get(parent, '_cid');
      if (_cid) this.toggleActivity({ _cid, expanded: true });
    },
    setCreateContext(levels) {
      this.showCreateDialog = true;
      this.supportedLevels = levels;
    },
    setCopyContext() {
      this.showCopyDialog = true;
      this.supportedLevels = this.levels;
    },
    delete() {
      const { activity, $route: { name: routeName } } = this;
      const isTreeView = routeName === TREE_VIEW_ROUTE;
      const action = () => {
        const rootFilter = it => !it.parentId && (it.id !== activity.id);
        // Focus parent or first root node
        const focusNode = activity.parentId
          ? find(this.activities, { id: activity.parentId })
          : first(sortBy(filter(this.activities, rootFilter), 'position'));
        this.remove(this.activity);
        if (focusNode) this.focusActivity(focusNode._cid);
      };
      const name = `${isTreeView ? `${activity.id}: ` : ''}${activity.data.name}`;
      appChannel.emit('showConfirmationModal', {
        title: 'Delete item?',
        message: `Are you sure you want to delete ${name}?`,
        action
      });
    }
  },
  components: { CopyDialog, CreateDialog }
};
</script>
