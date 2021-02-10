<template>
  <v-chip
    v-if="changeType"
    :text-color="changeType === 'new' ? 'success' : 'secondary'"
    color="primary lighten-5"
    small round
    class="readonly font-weight-medium text-capitalize">
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
