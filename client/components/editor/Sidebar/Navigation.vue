<template>
  <div class="navigation-container">
    <v-sheet color="grey lighten-5" tile class="navigation-header">
      <v-hover v-slot:default="{ hover }">
        <v-text-field
          v-model="search"
          label="Search..."
          :background-color="hover ? 'primary lighten-3' : 'primary lighten-4'"
          clear-icon="mdi-close"
          prepend-inner-icon="mdi-magnify"
          solo clearable hide-details
          class="my-4 mx-3" />
      </v-hover>
      <v-divider class="mb-0" />
    </v-sheet>
    <v-treeview
      ref="activityTree"
      :items="activityTree"
      :active="active"
      :search="search"
      open-all
      class="pt-4">
      <template v-slot:label="{ item: { id, name, selectable } }">
        <div
          @click.stop="navigateTo(id)"
          :class="{ selectable, selected: isSelected(id) }"
          class="tree-node pl-2">
          <span class="primary--text text--darken-4 text-truncate">
            {{ name }}
          </span>
          <v-icon
            v-if="selectable"
            color="primary darken-4"
            class="ml-2 mr-3 open-icon">
            mdi-page-next-outline
          </v-icon>
        </div>
      </template>
    </v-treeview>
    <v-alert
      :value="!hasSearchResults"
      color="primary darken-2"
      text>
      No matches found.
    </v-alert>
  </div>
</template>

<script>
import { activity as activityUtils } from '@tailor/utils';

const { toTreeFormat } = activityUtils;

export default {
  name: 'activity-navigation',
  inject: ['$schemaService'],
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
    activityConfigs: vm => vm.$schemaService.getOutlineLevels(vm.repository.schema),
    activityTypes: vm => vm.activityConfigs.map(it => it.type),
    editableTypes: vm => vm.editableActivityConfigs.map(it => it.type),
    editableActivityConfigs() {
      return this.activityConfigs.filter(it => this.$schemaService.isEditable(it.type));
    },
    isActivitySelectable() {
      return activity => ({
        selectable: this.$schemaService.isEditable(activity.type)
      });
    },
    activityTree() {
      return toTreeFormat(this.activities, {
        filterNodesFn: this.$schemaService.filterOutlineActivities,
        processNodeFn: this.isActivitySelectable
      });
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
    },
    isSelected(activityId) {
      return this.selected.id === activityId;
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
  padding: 0.75rem 0 0;
}

.v-treeview {
  overflow-y: auto;

  ::v-deep {
    .v-treeview-node__toggle {
      outline: none;
    }

    .v-treeview-node__root::before {
      content: none;
    }

    .v-treeview-node__content {
      margin-left: 0;
    }

    .v-treeview-node__level {
      width: 0.75rem;
    }
  }
}

.tree-node {
  display: flex;
  align-items: center;
  min-height: 3rem;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    opacity: 0;
    background-color: currentColor;
    transition: 0.1s cubic-bezier(0.25, 0.8, 0.5, 1);
    pointer-events: none;
  }

  &.selected::before {
    opacity: 0.12;
  }

  &.selectable {
    justify-content: space-between;

    .open-icon {
      transition: opacity 0.15s ease 0.1s;
      opacity: 0;
    }

    &:not(.selected):hover {
      cursor: pointer;

      &::before {
        opacity: 0.04;
      }

      .open-icon {
        opacity: 1;
      }
    }
  }
}
</style>
