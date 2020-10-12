<template>
  <div>
    <v-sheet color="transparent" class="navigation-header">
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
      @update:active="navigateTo"
      :items="activityTree"
      :active.sync="active"
      :search="search"
      open-all activatable hoverable dense>
      <template v-slot:label="{ item: { name, selectable } }">
        <span :class="{ selectable }">{{ name }}</span>
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
    navigateTo([activityId]) {
      if (activityId === this.selected.id) return;
      const activity = this.activities.find(it => it.id === activityId);
      if (!activity || !this.isActivityEditable(activity)) return;
      this.$router.push({ name: 'editor', params: { activityId } });
    },
    isActivityEditable(activity) {
      return this.editableTypes.includes(activity.type);
    }
  },
  watch: {
    active([activityId]) {
      const activity = this.activities.find(it => it.id === activityId);
      // If not editable activity, keep the current one as active
      if (!activity || !this.isActivityEditable(activity)) {
        this.active = [this.selected.id];
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation-header {
  padding: 1.5rem 1rem 0.25rem 0.75rem;
}

.v-treeview ::v-deep {
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

.selectable {
  cursor: pointer;
}
</style>
