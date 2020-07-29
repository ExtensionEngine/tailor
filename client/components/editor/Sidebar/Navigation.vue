<template>
  <div class="navigation-container">
    <v-sheet color="transparent" class="navigation-header" elevation="1" tile>
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
      :items="activityTree"
      :active="active"
      :search="search"
      open-all
      hoverable>
      <template v-slot:label="{ item: { id, name, selectable } }">
        <div :class="{ selectable }">
          {{ name }}
          <v-btn
            v-if="selectable"
            @click.stop="navigateTo(id)"
            color="blue-grey darken-4"
            icon
            class="mr-1 open-button">
            <v-icon>mdi-open-in-app</v-icon>
          </v-btn>
        </div>
      </template>
    </v-treeview>
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
  padding: 0.5rem 0.25rem;
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

  .open-button {
    transition: opacity 0.5s ease 0.2s;
    opacity: 0;
  }

  &:hover {
    .open-button {
      opacity: 1;
    }
  }
}
</style>
