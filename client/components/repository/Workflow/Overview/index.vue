<template>
  <v-data-table
    :headers="headers"
    :items="items"
    height="100%"
    item-class="class"
    disable-pagination hide-default-footer fixed-header
    class="overview primary lighten-5">
    <template v-slot:item="{ item }">
      <v-lazy
        v-model="itemVisibility[item.id]"
        @click="selectActivity(item.id)"
        :class="{ selected: isActivitySelected(item.id) }"
        tag="tr"
        style="height: 48px;">
        <div style="display: contents;">
          <td class="text-left">
            <v-col class="d-flex text-left">
              <overview-name :value="item.name" />
              <publishing-badge v-if="isAdmin || isRepositoryAdmin" :activity="item" />
            </v-col>
          </td>
          <td class="text-left">
            <overview-status v-bind="item.status" />
          </td>
          <td class="text-left">
            <overview-assignee v-bind="item.assignee" />
          </td>
          <td class="text-left">
            <overview-priority v-bind="item.priority" />
          </td>
          <td class="text-left">
            <overview-due-date v-if="item.dueDate" :value="item.dueDate" />
          </td>
        </div>
      </v-lazy>
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
  data: () => ({
    itemVisibility: {}
  }),
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

.overview ::v-deep {
  thead.v-data-table-header {
    tr th {
      background: $row-hover-background;
    }
  }

  .column-name {
    max-width: 17.75rem;
  }

  .column-assignee {
    max-width: 11.5rem;
  }

  .v-lazy {
    background-color: $row-background;
    border-bottom: thin solid rgba(0, 0, 0, 0.12);

    &:hover {
      background-color: $row-hover-background !important;
    }

    &.selected {
      background: $row-hover-background !important;
    }

    &:not(.selected) {
      cursor: pointer;
    }

    td {
      height: 48px;
    }
  }
}
</style>
