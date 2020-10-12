<template>
  <div class="navigation-container">
    <v-sheet color="transparent" elevation="1" tile class="navigation-header">
      <v-text-field
        v-model="search"
        label="Search..."
        background-color="grey lighten-2"
        clear-icon="mdi-close"
        prepend-inner-icon="mdi-magnify"
        solo clearable hide-details
        class="my-3 mx-1" />
    </v-sheet>
    <v-treeview
      ref="activityTree"
      :items="activityTree"
      :active="active"
      :search="search"
      open-all>
      <template v-slot:label="{ item: { id, name, selectable } }">
        <div @click.stop="navigateTo(id)" :class="{ selectable }">
          {{ name }}
          <v-icon
            v-if="selectable"
            color="blue-grey darken-4"
            class="mr-1 open-icon">
            mdi-open-in-app
          </v-icon>
        </div>
      </template>
    </v-treeview>
    <v-alert
      :value="!hasSearchResults"
      color="primary"
      text>
      No matches found.
    </v-alert>
  </div>
</template>

<script>
import { getOutlineLevels, isEditable } from 'shared/activities';
import { toTreeFormat } from 'utils/activity';

export default {
  name: 'activity-navigation',
  props: {
    repository: { type: Object, required: true },
    activities: { type: Array, required: true },
    selected: { type: Object, required: true }
  },
  data() {
    return {
      active: [this.selected.id],
      search: ''
    };
  },
  computed: {
    activityTree: vm => toTreeFormat(vm.activities, vm.editableActivityConfigs),
    activityConfigs: vm => getOutlineLevels(vm.repository.schema),
    activityTypes: vm => vm.activityConfigs.map(it => it.type),
    editableTypes: vm => vm.editableActivityConfigs.map(it => it.type),
    editableActivityConfigs() {
      return this.activityConfigs.filter(it => isEditable(it.type));
    },
    hasSearchResults() {
      if (!this.search || !this.$refs) return true;
      const { excludedItems, nodes } = this.$refs.activityTree;
      return excludedItems.size !== Object.keys(nodes).length;
    }
  },
  methods: {
    navigateTo(activityId) {
      if (activityId === this.selected.id) return;

      const activity = this.activities.find(it => it.id === activityId);
      if (!activity || !this.isActivityEditable(activity)) return;

      this.active = [activityId];
      this.$router.push({ name: 'editor', params: { activityId } });
    },
    isActivityEditable(activity) {
      return this.editableTypes.includes(activity.type);
    }
  },
  watch: {
    search() {
      return this.$refs.activityTree.updateAll(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.navigation-header {
  padding: 0.75rem 1rem 0.75rem 0.75rem;
}

.v-treeview {
  overflow-y: auto;

  ::v-deep {
    .v-treeview-node__toggle {
      outline: none;
    }

    .v-treeview-node__content {
      margin-left: 0;
    }

    .v-treeview-node__level {
      width: 0.75rem;
    }
  }
}

.selectable {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    background-color: currentColor;
    transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  }

  .open-icon {
    transition: opacity 0.3s ease 0.15s;
    opacity: 0;
  }

  &:hover {
    cursor: pointer;

    &::before {
      opacity: 0.12;
    }

    .open-icon {
      opacity: 1;
    }
  }
}
</style>
