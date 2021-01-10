<template>
  <v-chip
    v-if="changeType"
    :text-color="changeType === 'added' ? 'success' : 'secondary'"
    color="blue-grey lighten-5"
    small round
    class="readonly ml-auto font-weight-medium text-capitalize">
    {{ changeType }}
  </v-chip>
</template>

<script>
export default {
  name: 'publish-diff-chip',
  props: {
    changeType: { type: String, default: null }
  }
};
</script>
