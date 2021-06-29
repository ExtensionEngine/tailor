<template>
  <v-data-table
    :headers="headers"
    :items="items"
    height="100%"
    disable-pagination hide-default-footer fixed-header
    class="overview primary lighten-5">
    <template v-slot:body="props">
      <v-virtual-scroll :items="props.items" item-height="46">
        <template v-slot:default="{ item }">
          <v-row
            @click="selectActivity(item.id)"
            :class="{ selected: isActivitySelected(item.id) }">
            <v-col class="name d-flex text-left">
              <overview-name :value="item.name" />
              <publishing-badge v-if="isAdmin || isRepositoryAdmin" :activity="item" />
            </v-col>
            <div class="status d-flex align-center text-left">
              <overview-status v-bind="item.status" />
            </div>
            <div class="assignee d-flex align-center text-left">
              <overview-assignee v-bind="item.assignee" />
            </div>
            <div class="priority d-flex align-center text-left">
              <overview-priority v-bind="item.priority" />
            </div>
            <div class="date d-flex align-center text-left">
              <overview-due-date v-if="item.dueDate" :value="item.dueDate" />
            </div>
          </v-row>
        </template>
      </v-virtual-scroll>
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
import PublishingBadge from '@/components/repository/common/Sidebar/Badge';
import selectActivity from '@/components/repository/common/selectActivity';

export default {
  name: 'workflow-overview',
  mixins: [selectActivity],
  props: {
    activities: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters(['isAdmin']),
    ...mapGetters('repository', ['isRepositoryAdmin', 'workflow']),
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
        priority: getPriority(status.priority)
      }));
    }
  },
  methods: {
    selectItem(id) {
      this.selectedItemId = id;
    },
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
    PublishingBadge,
    OverviewAssignee,
    OverviewDueDate,
    OverviewName,
    OverviewPriority,
    OverviewStatus
  }
};
</script>

<style lang="scss" scoped>
$row-background: var(--v-primary-lighten5);
$row-hover-background: var(--v-primary-lighten4);
$status-max-width: 180px;
$assignee-max-width: 340px;
$priority-max-width: 180px;
$date-max-width: 160px;

.overview ::v-deep {
  table {
    table-layout: fixed;

    th:nth-of-type(1), .name {
      max-width: calc(100% - #{$status-max-width} - #{$assignee-max-width} - #{$priority-max-width} - #{$date-max-width});
    }

    .name .v-badge {
      padding-left: 8px;
    }

    th:nth-of-type(2), .status {
      width: $status-max-width;
    }

    th:nth-of-type(3), .assignee {
      width: $assignee-max-width;
    }

    th:nth-of-type(4), .priority {
      width: $priority-max-width;
    }

    th:nth-of-type(5), .date {
      width: $date-max-width;
    }
  }

  thead.v-data-table-header {
    tr th {
      background: $row-background;
    }

    tr:hover {
      th {
        background: $row-hover-background !important;
      }
    }
  }

  .row {
    margin: 0;
    background-color: $row-background;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);

    &:hover {
      background-color: $row-hover-background;
    }

    &.selected {
      background: $row-hover-background;
    }

    &:not(.selected) {
      cursor: pointer;
    }
  }

  .v-virtual-scroll {
    display: table-row-group;
  }
}
</style>
