<template>
  <v-carousel-item light class="carousel-item blue-grey lighten-5">
    <v-alert
      v-if="!hasElements && !isDisabled"
      color="blue-grey darken-2"
      icon="mdi-information-variant"
      text prominent
      class="ma-6">
      Click the button below to add content element.
    </v-alert>
    <embedded-container
      @save="({ embeds }) => save(item, embeds)"
      @delete="deleteEmbed($event)"
      :container="{ embeds }"
      :is-disabled="isDisabled" />
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
    isDisabled: { type: Boolean, default: false }
  },
  computed: {
    hasElements: vm => !isEmpty(vm.embeds)
  },
  methods: {
    save(item, embeds = {}) {
      item = cloneDeep(item);
      forEach(embeds, it => (item.body[it.id] = true));
      this.$emit('save', { item, embeds });
    },
    deleteEmbed(embed) {
      const embeds = { ...this.embeds };
      const item = { ...this.item };
      delete embeds[embed.id];
      delete item.body[embed.id];
      this.$emit('save', { item, embeds });
    }
  },
  components: { EmbeddedContainer }
};
</script>

<style lang="scss" scoped>
.carousel-item ::v-deep .v-responsive__content {
  padding-bottom: 2rem;
  overflow-y: auto;
}
</style>
