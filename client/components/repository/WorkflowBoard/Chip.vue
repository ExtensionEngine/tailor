<template functional>
  <v-chip
    color="blue-grey lighten-5"
    class="font-weight-medium subtitle-2"
    label
    small>
    {{ props.id }}
  </v-chip>
</template>

<script>
export default {
  name: 'workflow-board-chip',
  props: {
    id: { type: String, required: true }
  }
};
</script>
