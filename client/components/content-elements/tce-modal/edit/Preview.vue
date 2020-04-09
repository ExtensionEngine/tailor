<template>
  <tailor-dialog
    @click:outside="$emit('close')"
    :value="true"
    header-icon="mdi-window-restore">
    <template #header>Modal</template>
    <template #body>
      <content-element
        v-for="it in elements"
        :key="it.id"
        :element="it"
        :is-disabled="true"
        :frame="false" />
    </template>
    <template #actions>
      <v-btn @click="hide" text>Close</v-btn>
    </template>
  </tailor-dialog>
</template>

<script>
import { ContentElement } from 'tce-core';
import TailorDialog from '@/components/common/TailorDialog';

export default {
  props: {
    elements: { type: Array, default: () => ([]) }
  },
  methods: {
    hide() {
      this.$emit('close');
    }
  },
  components: { ContentElement, TailorDialog }
};
</script>
