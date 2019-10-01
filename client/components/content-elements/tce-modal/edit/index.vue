<template>
  <div class="tce-modal">
    <div v-if="isEditing">
      <v-alert v-if="!hasElements" class="placeholder">
        Click the button below to Add first teaching element to your modal.
      </v-alert>
      <embedded-container
        @save="$emit('save', $event)"
        @delete="deleteEmbed($event)"
        :container="element.data" />
    </div>
    <v-dialog v-if="!isEditing" v-model="showModal" width="640">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" color="primary">{{ title }}</v-btn>
      </template>
      <v-card>
        <content-element
          v-for="it in embeds"
          :key="it.id"
          :element="it"
          :is-disabled="true"
          :frame="false" />
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn @click="showModal = false" color="primary" text>
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ContentElement, EmbeddedContainer } from 'tce-core';
import cloneDeep from 'lodash/cloneDeep';
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
  },
  components: { EmbeddedContainer, ContentElement }
};
</script>

<style lang="scss" scoped>
.tce-modal {
  .placeholder {
    margin: 0;
    background: #f5f5f5;
  }
}
</style>
