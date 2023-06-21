<template>
  <div class="tce-modal">
    <v-toolbar
      height="32"
      color="grey darken-3"
      dark
      class="text-left elevation-5">
      <span class="text-subtitle-2 mr-4">Modal</span>
      <span v-if="!isDisabled" class="text-truncate">
        Use toolbar to toggle between edit and preview state
      </span>
    </v-toolbar>
    <div class="px-8 py-3 primary lighten-5">
      <template v-if="!isDisabled && isEditing">
        <v-alert
          v-if="!hasElements"
          color="primary darken-2"
          icon="mdi-information-variant"
          text prominent
          class="mt-6">
          Click the button below to add content element.
        </v-alert>
        <embedded-container
          @save="$emit('save', $event)"
          @delete="deleteEmbed($event)"
          :container="element.data" />
      </template>
      <preview
        v-else
        :label="title"
        :elements="embeds"
        :is-disabled="isDisabled" />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from '@tailor-cms/core-components';
import Preview from './Preview.vue';
import values from 'lodash/values';

export default {
  name: 'tce-modal',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, required: true },
    isDisabled: { type: Boolean, default: false }
  },
  data() {
    return { isEditing: false };
  },
  computed: {
    title: vm => vm.element.data.title || 'Open modal',
    hasElements: vm => vm.embeds.length,
    embeds() {
      const items = this.element.data.embeds;
      return items ? values(items).sort((a, b) => a.position - b.position) : [];
    }
  },
  methods: {
    deleteEmbed(item) {
      const data = cloneDeep(this.element.data);
      delete data.embeds[item.id];
      this.$emit('save', data);
    }
  },
  created() {
    this.$elementBus.on('toggleEdit', () => (this.isEditing = !this.isEditing));
    this.$elementBus.on('save', data => this.$emit('save', data));
    this.isEditing = !this.hasElements;
  },
  components: { EmbeddedContainer, Preview }
};
</script>
