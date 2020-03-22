<template>
  <li :class="{ active: isActive }" class="container-fluid carousel-item">
    <div v-if="!hasElements" class="well">
      Click the button below to Create your first content element.
    </div>
    <embedded-container
      @save="({ embeds }) => save(item, embeds)"
      @delete="deleteEmbed($event)"
      :container="{ embeds }" />
  </li>
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
    isActive() {
      return this.item.id === this.activeItem;
    },
    hasElements() {
      return !isEmpty(this.embeds);
    }
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
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: inherit;
  opacity: 0;
  z-index: 1;
  overflow-y: auto;
  transition: opacity 300ms cubic-bezier(0.165, 0.84, 0.44, 1);

  .mdi {
    color: #707070;
    font-size: 22px;

    &:hover {
      color: #444;
      cursor: pointer;
    }
  }
}

.active {
  opacity: 1;
  z-index: 2;
}

.disabled .add-element {
  display: none;
}
</style>
