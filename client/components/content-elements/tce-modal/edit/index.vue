<template>
  <div class="tce-modal">
    <div v-if="isEditing" class="container-fluid">
      <div v-if="!hasElements" class="well">
        Click the button below to Add first content element to your modal.
      </div>
      <embedded-container
        @save="$emit('save', $event)"
        @delete="deleteEmbed($event)"
        :container="element.data" />
    </div>
    <button
      v-else
      @click="showModal = true"
      class="btn btn-primary btn-open"
      type="button">
      {{ title }}
    </button>
    <preview
      v-if="showModal"
      @close="showModal = false"
      :elements="embeds" />
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
