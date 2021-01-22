<template>
  <div class="overview">
    <v-data-table
      @click:row="selectTask($event.id)"
      :headers="headers"
      :items="items"
      item-class="class"
      hide-default-footer>
      <template #item.status="{ value }">
        <span
          v-if="value"
          :style="{ 'background-color': value.color }"
          class="status px-2 py-1 rounded">
          {{ value.label }}
        </span>
      </template>
      <template #item.assignee="{ value }">
        <assignee-avatar v-bind="value" small class="mr-2" />
        <span v-if="value && value.label">{{ value.label }}</span>
        <span v-else>Unassigned</span>
      </template>
      <template #item.priority="{ value }">
        <v-icon class="priority-icon mr-3">
          {{ `$vuetify.icons.${value.icon}` }}
        </v-icon>
        {{ value.label }}
      </template>
      <template #item.dueDate="{ value }">
        {{ value | formatDate('MM/DD/YY') }}
      </template>
    </v-data-table>
  </div>
</template>

<script>
import AssigneeAvatar from '@/components/repository/common/AssigneeAvatar';
import { mapGetters } from 'vuex';
import { priorities } from 'shared/workflow';
import selectTask from '@/components/repository/common/selectTask';

export default {
  name: 'workflow-overview',
  mixins: [selectTask],
  props: {
    tasks: { type: Array, default: () => [] }
  },
  computed: {
    ...mapGetters('repository', ['workflow']),
    headers() {
      console.log(this.items);
      return [{
        text: 'Task',
        value: 'activity.data.name'
      }, {
        text: 'ID',
        value: 'shortId'
      }, {
        text: 'Status',
        value: 'status'
      }, {
        text: 'Assignee',
        value: 'assignee'
      }, {
        text: 'Priority',
        value: 'priority',
        sortable: true
      }, {
        text: 'Due date',
        value: 'dueDate'
      }];
    },
    items() {
      return this.tasks.map(it => ({
        ...it,
        status: this.getStatusById(it.status),
        priority: this.getPriorityById(it.priority),
        class: this.isTaskSelected(it) && 'selected'
      }));
    }
  },
  methods: {
    getStatusById(id) {
      return this.workflow.statuses.find(it => it.id === id);
    },
    getPriorityById(id) {
      return priorities.find(it => it.id === id);
    },
    isTaskSelected(task) {
      return this.selectedTask && this.selectedTask.id === task.id;
    }
  },
  components: { AssigneeAvatar }
};
</script>

<style lang="scss" scoped>
.overview ::v-deep .v-data-table {
  tr > td:first-of-type {
    max-width: 200px;
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
