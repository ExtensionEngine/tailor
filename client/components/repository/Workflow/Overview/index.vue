<template>
  <v-data-table
    @click:row="selectActivity($event.id)"
    :headers="headers"
    :items="items"
    height="100%"
    item-class="class"
    disable-pagination hide-default-footer fixed-header
    class="overview primary lighten-5">
    <template #item.name="{ item, value }">
      <div class="d-flex">
        <overview-name :value="value" />
        <publishing
          v-if="isAdmin || isRepositoryAdmin"
          :activity="item"
          :outline-activities="outlineActivities"
          hide-publish
          hide-details />
      </div>
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
import { getPriority, priorities } from 'shared/workflow';
import { mapGetters } from 'vuex';
import OverviewAssignee from './Assignee';
import OverviewDueDate from './DueDate';
import OverviewName from './Name';
import OverviewPriority from './Priority';
import OverviewStatus from './Status';
import Publishing from '@/components/repository/common/Sidebar/Publishing';
import selectActivity from '@/components/repository/common/selectActivity';

export default {
  name: 'workflow-overview',
  mixins: [selectActivity],
  props: {
    activities: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['isRepositoryAdmin', 'workflow', 'outlineActivities']),
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
      return this.activities.map(({ id, data, modifiedAt, publishedAt, status, type }) => ({
        ...status,
        id,
        name: data.name,
        modifiedAt,
        publishedAt,
        type,
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
      return this.workflow.statuses.find(it => it.id === id);
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
    Publishing,
    OverviewAssignee,
    OverviewDueDate,
    OverviewName,
    OverviewPriority,
    OverviewStatus
  }
};
</script>

<style lang="scss" scoped>
$row-background: var(--v-primary-lighten4);

.overview ::v-deep {
  thead.v-data-table-header {
    tr th {
      background: #eceff1;
    }
  }

  .column-name {
    max-width: 17.75rem;
  }

  .column-assignee {
    max-width: 11.5rem;
  }

  tr:hover {
    background: $row-background !important;

    &:not(.selected) {
      cursor: pointer;
    }
  }

  .selected {
    background: $row-background;
  }
}
</style>
