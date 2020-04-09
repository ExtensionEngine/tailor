<template>
  <div class="tce-modal">
    <v-sheet v-if="hasElements">
      <v-chip
        class="ma-2"
        color="grey darken-1"
        text-color="white">
        <v-avatar left>
          <v-icon>mdi-dock-window</v-icon>
        </v-avatar>
        Modal
      </v-chip>
      <button
        @click="showModal = true"
        class="btn btn-primary btn-open"
        type="button">
        {{ title }}
      </button>
    </v-sheet>
    <v-sheet v-else class="pa-12">
      <v-avatar size="60" color="blue-grey darken-4">
        <v-icon :size="isFocused ? 38 : 30" color="white">mdi-window-restore</v-icon>
      </v-avatar>
      <div class="headline my-4">Modal component</div>
      <div class="subtitle-1">
        <template v-if="!isFocused">Select to edit</template>
        <template v-else>
          Use toolbar
          <v-icon size="22" color="secondary">mdi-transfer-up</v-icon>
          to add modal content
        </template>
      </div>
    </v-sheet>
    <div v-if="isEditing" class="container-fluid">
      <v-alert v-if="!hasElements" color="grey lighten-4">
        Click the button below to Add first content to your modal.
      </v-alert>
      <embedded-container
        @save="$emit('save', $event)"
        @delete="deleteEmbed($event)"
        :container="element.data" />
    </div>
    <preview
      v-if="showModal"
      @close="showModal = false"
      :elements="embeds" />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from 'tce-core';
import get from 'lodash/get';
import Preview from './Preview';
import values from 'lodash/values';

export default {
  name: 'tce-modal',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      isEditing: false,
      showModal: false
    };
  },
  computed: {
    title() {
      return this.element.data.title || 'Open modal';
    },
    embeds() {
      const items = this.element.data.embeds;
      return items ? values(items).sort((a, b) => a.position - b.position) : [];
    },
    hasElements() {
      return this.embeds.length;
    },
    isFocused() {
      return get(this.$attrs, 'is-focused', false);
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

<style lang="scss" scoped>
.btn-open {
  max-width: 90%;
  padding: 9px 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
