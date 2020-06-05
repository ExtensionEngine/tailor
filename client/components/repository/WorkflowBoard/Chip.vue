<template functional>
  <v-chip label small>{{ props.id }}</v-chip>
</template>

<script>
export default {
  name: 'workflow-board-chip',
  props: {
    id: { type: String, required: true }
  }
};
</script>
