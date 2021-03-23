<template>
  <workflow-due-date :value="value" format="mediumDate" icon />
</template>

<script>
import WorkflowDueDate from '@/components/repository/common/WorkflowDueDate';

export default {
  name: 'overview-due-date',
  props: {
    value: { type: String, required: true }
  },
  components: { WorkflowDueDate }
};
</script>
