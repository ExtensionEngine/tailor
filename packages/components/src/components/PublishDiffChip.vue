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
import { publishDiffChangeTypes } from '@extensionengine/tce-utils';

export default {
  name: 'tailor-publish-diff-chip',
  props: {
    changeType: {
      validator: function (value) {
        if (!value) return true;
        return Object.values(publishDiffChangeTypes).includes(value);
      },
      default: null
    }
  }
};
</script>
