<template>
  <div>
    <v-sheet color="transparent" class="navigation-header">
      <h4 class="body-1 my-2 mx-1">Navigation</h4>
      <v-text-field
        v-model="search"
        label="Search"
        clear-icon="mdi-close"
        clearable hide-details outlined
        class="my-3 mx-1" />
    </v-sheet>
    <v-treeview
      @update:active="navigateTo"
      :items="activityTree"
      :active.sync="active"
      :search="search"
      activatable hoverable dense />
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
    activityTypes: vm => getOutlineLevels(vm.repository.schema).map(it => it.type),
    editableTypes: vm => vm.activityTypes.filter(isEditable),
    activityTree: vm => toTreeFormat(vm.activities, [])
  },
  methods: {
    navigateTo([activityId]) {
      if (activityId === this.selected.id) return;
      const activity = this.activities.find(it => it.id === activityId);
      if (!activity || !this.isActivityEditable(activity)) return;
      this.$router.push({ name: 'editor', params: { activityId } });
    },
    isActivityEditable(activity) {
      return this.editableTypes.find(type => type === activity.type);
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
  padding: 1rem 1rem 0.25rem 0.75rem;
}
</style>
