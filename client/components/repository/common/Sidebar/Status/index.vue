<template>
  <div>
    <div class="d-flex justify-space-between align-center">
      <h5>Status</h5>
    </div>
    <status-card v-bind="$attrs" />
  </div>
</template>

<script>
import StatusCard from './Card';

export default {
  name: 'sidebar-activity-status',
  components: { StatusCard }
};
</script>
