<template>
  <v-data-table
    @click:row="selectActivity($event.id)"
    :headers="headers"
    :items="items"
    item-class="class"
    disable-pagination hide-default-footer
    class="overview">
    <template #item.name="item">
      <overview-name v-bind="item" />
    </template>
    <template #item.status="{ value }">
      <overview-status v-bind="value" />
    </template>
    <template #item.assignee="{ value }">
      <assignee-avatar v-bind="value" small class="mr-1" />
      <span v-if="value && value.label">{{ value.label }}</span>
      <span v-else>Unassigned</span>
    </template>
    <template #item.priority="{ value }">
      <overview-priority v-bind="value" />
    </template>
    <template #item.dueDate="item">
      <overview-due-date v-bind="item" />
    </template>
  </v-data-table>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import { mapGetters } from 'vuex';
import OverviewDueDate from './DueDate';
import OverviewName from './Name';
import OverviewPriority from './Priority';
import OverviewStatus from './Status';
import { priorities } from 'shared/workflow';
import selectActivity from '@/components/repository/common/selectActivity';

export default {
  name: 'workflow-overview',
  mixins: [selectActivity],
  props: {
    activities: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    headers() {
      return [{
        text: 'Name',
        value: 'name'
      }, {
        text: 'Status',
        value: 'status',
        sort: this.sortByStatus
      }, {
        text: 'Assignee',
        value: 'assignee',
        sort: this.sortByAssignee
      }, {
        text: 'Priority',
        value: 'priority',
        sortable: true,
        sort: this.sortByPriority
      }, {
        text: 'Due date',
        value: 'dueDate'
      }];
    },
    items() {
      return this.activities.map(({ id, data, status }) => ({
        ...status,
        id,
        name: data.name,
        status: this.getStatusById(status.status),
        priority: this.getPriorityById(status.priority),
        class: this.isActivitySelected(id) && 'selected'
      }));
    }
  },
  methods: {
    isActivitySelected(id) {
      return this.selectedActivity && this.selectedActivity.id === id;
    },
    getStatusById(id) {
      return this.workflow.statuses.find(it => it.id === id);
    },
    getPriorityById(id) {
      return priorities.find(it => it.id === id);
    },
    sortByStatus(first, second) {
      const statusIds = this.workflow.statuses.map(it => it.id);
      return statusIds.indexOf(first.id) - statusIds.indexOf(second.id);
    },
    sortByAssignee(first, second) {
      if (!second || !second.label) return -1;
      if (!first || !first.label) return 1;
      return first.label.localeCompare(second.label);
    },
    sortByPriority(first, second) {
      const priorityIds = priorities.map(it => it.id);
      return priorityIds.indexOf(second.id) - priorityIds.indexOf(first.id);
    }
  },
  components: { AssigneeAvatar, OverviewDueDate, OverviewName, OverviewPriority, OverviewStatus }
};
</script>

<style lang="scss" scoped>
.overview ::v-deep {
  tr > td:first-of-type {
    max-width: 22rem;
  }

  .selected {
    background: #eceff1;
  }

  tr:hover:not(.selected) {
    cursor: pointer;
  }
}
</style>
