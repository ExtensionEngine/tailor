<template>
  <section>
    <h5>Related content</h5>
    <activity-card
      v-for="activity in activities"
      :key="activity.id"
      :activity="activity" />
  </section>
</template>

<script>
import ActivityCard from './ActivityCard';

export default {
  name: 'workflow-board-task-activities',
  props: {
    activities: {
      type: Array,
      default: () => ([])
    }
  },
  components: {
    ActivityCard
  }
};
</script>
