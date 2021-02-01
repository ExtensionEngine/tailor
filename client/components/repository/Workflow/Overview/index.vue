<template>
  <v-data-table
    @click:row="selectActivity($event.id)"
    :headers="headers"
    :items="items"
    item-class="class"
    disable-pagination hide-default-footer
    class="overview">
    <template #item.name="{ value }">
      <v-tooltip open-delay="800" bottom>
        <template #activator="{ on }">
          <div v-on="on" class="text-truncate">
            {{ value }}
          </div>
        </template>
        {{ value }}
      </v-tooltip>
    </template>
    <template #item.status="{ value }">
      <span :style="{ 'background-color': value.color }" class="status px-2 py-1 rounded">
        {{ value.label }}
      </span>
    </template>
    <template #item.assignee="{ value }">
      <assignee-avatar v-bind="value" small class="mr-1" />
      <span v-if="value && value.label">{{ value.label }}</span>
      <span v-else>Unassigned</span>
    </template>
    <template #item.priority="{ value }">
      <v-icon class="priority-icon mr-1">
        {{ `$vuetify.icons.${value.icon}` }}
      </v-icon>
      {{ value.label }}
    </template>
    <template #item.dueDate="{ value }">
      {{ value | formatDate('MM/DD/YY') }}
    </template>
  </v-data-table>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import { mapGetters } from 'vuex';
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
        id,
        name: data.name,
        assignee: status.assignee,
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
  components: { AssigneeAvatar }
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

  .status {
    color: var(--text-color-default);
  }

  .priority-icon {
    width: 0.75rem;
  }
}
</style>
