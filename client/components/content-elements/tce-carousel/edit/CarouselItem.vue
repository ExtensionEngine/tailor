<template>
  <v-carousel-item class="blue-grey lighten-5">
    <v-alert
      v-if="!hasElements"
      color="blue-grey darken-2"
      icon="mdi-information-variant"
      text prominent
      class="ma-6">
      Click the button below to add content element.
    </v-alert>
    <embedded-container
      @save="({ embeds }) => save(item, embeds)"
      @delete="deleteEmbed($event)"
      :container="{ embeds }" />
  </v-carousel-item>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { EmbeddedContainer } from 'tce-core';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';

export default {
  name: 'carousel-item',
  props: {
    item: { type: Object, required: true },
    embeds: { type: Object, default: () => ({}) },
    activeItem: { type: Number, default: null }
  },
  computed: {
    isActive: vm => vm.item.id === vm.activeItem,
    hasElements: vm => !isEmpty(vm.embeds)
  },
  methods: {
    save(item, embeds = {}) {
      item = cloneDeep(item);
      forEach(embeds, it => (item.body[it.id] = true));
      this.$emit('save', { item, embeds });
    },
    deleteEmbed(embed) {
      const embeds = cloneDeep(this.embeds);
      const item = cloneDeep(this.item);
      delete embeds[embed.id];
      delete item.body[embed.id];
      this.$emit('save', { item, embeds });
    }
  },
  components: { EmbeddedContainer }
};
</script>

<style lang="scss" scoped>
.disabled .add-element {
  display: none;
}
</style>
