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
      <overview-assignee v-bind="value" />
    </template>
    <template #item.priority="{ value }">
      <overview-priority v-bind="value" />
    </template>
    <template #item.dueDate="{ value }">
      <overview-due-date v-if="value" :value="value" />
    </template>
  </v-data-table>
</template>

<script>
import { getPriority, getStatus, priorities } from 'shared/workflow';
import { mapGetters } from 'vuex';
import OverviewAssignee from './Assignee';
import OverviewDueDate from './DueDate';
import OverviewName from './Name';
import OverviewPriority from './Priority';
import OverviewStatus from './Status';
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
        sort: this.compareStatuses
      }, {
        text: 'Assignee',
        value: 'assignee',
        sort: this.compareAssignees
      }, {
        text: 'Priority',
        value: 'priority',
        sort: this.comparePriorities
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
        priority: getPriority(status.priority),
        class: this.isActivitySelected(id) && 'selected'
      }));
    }
  },
  methods: {
    isActivitySelected(id) {
      return this.selectedActivity && this.selectedActivity.id === id;
    },
    getStatusById(id) {
      return getStatus(id, this.workflow.id);
    },
    compareStatuses(first, second) {
      const statusIds = this.workflow.statuses.map(it => it.id);
      return statusIds.indexOf(first.id) - statusIds.indexOf(second.id);
    },
    compareAssignees(first, second) {
      if (!second || !second.label) return -1;
      if (!first || !first.label) return 1;
      return first.label.localeCompare(second.label);
    },
    comparePriorities(first, second) {
      const priorityIds = priorities.map(it => it.id);
      return priorityIds.indexOf(second.id) - priorityIds.indexOf(first.id);
    }
  },
  components: {
    OverviewAssignee,
    OverviewDueDate,
    OverviewName,
    OverviewPriority,
    OverviewStatus
  }
};
</script>

<style lang="scss" scoped>
.overview ::v-deep {
  .column-name {
    max-width: 17.75rem;
  }

  .column-assignee {
    max-width: 11.5rem;
  }

  tr:hover:not(.selected) {
    cursor: pointer;
  }

  .selected {
    background: #eceff1;
  }
}
</style>
