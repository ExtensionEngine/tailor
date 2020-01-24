<template>
  <div>
    <v-menu max-width="350" offset-y left>
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="primary darken-1" icon tile>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list class="text-left">
        <v-list-item
          v-for="it in menuOptions"
          :key="it.name"
          @click="it.action && it.action()"
          :disabled="!it.action"
          dense>
          <v-list-item-title>
            <v-icon>mdi-{{ it.icon }}</v-icon>
            {{ it.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <create-dialog
      v-if="showCreateModal"
      @close="showCreateModal = null"
      @expand="$emit('expand')"
      :repository-id="activity.repositoryId"
      :levels="supportedLevels"
      :anchor="activity" />
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import CreateDialog from '../Outline/InsertActivity/CreateDialog';
import EventBus from 'EventBus';
import filter from 'lodash/filter';
import find from 'lodash/find';
import first from 'lodash/first';
import get from 'lodash/get';
import { getParent } from 'utils/activity';
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
    showCreateModal: false,
    supportedLevels: []
  }),
  computed: {
    ...mapGetters(['activities']),
    ...mapGetters('course', ['structure']),
    menuOptions() {
      const items = [{ name: 'Add bellow', icon: 'arrow-down' }];
      items.push(...this.getCreateOptions(this.sameLevel));
      items.push({ name: 'Add into', icon: 'subdirectory-arrow-right' });
      items.push(...this.getCreateOptions(this.subLevels));
      items.push({ name: 'Remove', action: () => this.delete(this.activity) });
      return items;
    },
    levels: vm => vm.sameLevel.concat(vm.subLevels),
    sameLevel() {
      const grandParent = getParent(this.activities, this.activity);
      const sameLevelTypes = grandParent
        ? get(find(this.structure, { type: grandParent.type }), 'subLevels', [])
        : map(filter(this.structure, { level: 1 }), 'type');
      return filter(this.structure, it => sameLevelTypes.includes(it.type));
    },
    subLevels() {
      const { subLevels = [] } = find(this.structure, { type: this.activity.type });
      return filter(this.structure, it => subLevels.includes(it.type));
    }
  },
  methods: {
    ...mapActions('activities', ['remove']),
    ...mapMutations('course', ['focusActivity']),
    getCreateOptions(items) {
      return items.map(it => ({
        name: it.label,
        action: () => this.setCreateContext(it)
      }));
    },
    setCreateContext(level) {
      this.showCreateModal = true;
      this.supportedLevels = [level];
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
  components: { CreateDialog }
};
</script>
