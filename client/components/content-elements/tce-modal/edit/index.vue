<template>
  <div class="tce-modal">
    <v-toolbar
      height="32"
      color="grey darken-3"
      dark
      class="text-left elevation-5">
      <span class="subtitle-2 mr-4">Modal</span>
      <span class="text-truncate">
        Use toolbar to toggle between edit and preview state
      </span>
    </v-toolbar>
    <div class="px-8 py-3 blue-grey lighten-5">
      <template v-if="isEditing">
        <v-alert
          v-if="!hasElements"
          color="blue-grey darken-2"
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
        :elements="embeds" />
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from 'tce-core';
import Preview from './Preview';
import values from 'lodash/values';

export default {
  name: 'tce-modal',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, required: true }
  },
  data() {
    return { isEditing: !this.hasElements };
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
  },
  components: { EmbeddedContainer, Preview }
};
</script>
