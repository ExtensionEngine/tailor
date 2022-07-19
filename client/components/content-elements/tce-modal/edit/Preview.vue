<template>
  <v-dialog v-model="visible" width="800">
    <template #activator="{ on }">
      <v-btn
        v-on="on"
        :disabled="isDisabled || !elements.length"
        color="primary lighten-4"
        class="my-3">
        {{ label }}
      </v-btn>
    </template>
    <v-card>
      <v-card-text class="pa-8">
        <content-element
          v-for="it in elements"
          :key="it.id"
          :element="it"
          :frame="false"
          is-disabled />
      </v-card-text>
      <v-card-actions class="py-2 px-6">
        <v-spacer />
        <v-btn @click="visible = false" text>Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ContentElement } from '@tailor-cms/core-components';

export default {
  name: 'tce-modal-preview',
  props: {
    label: { type: String, default: 'Show dialog' },
    isDisabled: { type: Boolean, default: false },
    elements: { type: Array, default: () => [] }
  },
  data() {
    return { visible: false };
  },
  components: {
    ContentElement
  }
};
</script>
