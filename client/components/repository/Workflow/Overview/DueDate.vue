<template>
  <activity-due-date :value="value" format="mediumDate" icon />
</template>

<script>
import ActivityDueDate from '@/components/repository/common/DueDate';

export default {
  name: 'overview-due-date',
  props: {
    value: { type: String, required: true }
  },
  components: { ActivityDueDate }
};
</script>
