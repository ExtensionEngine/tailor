<template>
  <div class="tce-carousel">
    <v-toolbar
      v-if="hasItems"
      height="32"
      color="grey darken-3"
      dark
      class="text-left elevation-5">
      <span class="subtitle-2 mr-4">Carousel</span>
      <span class="text-truncate">
        Use the bottom navigation to switch to the next item
      </span>
    </v-toolbar>
    <element-placeholder
      v-if="!hasItems"
      :is-focused="isFocused"
      :is-disabled="isDisabled"
      name="Carousel"
      icon="mdi-view-carousel"
      active-placeholder="Use toolbar to add the first slide to the carousel"
      active-icon="mdi-arrow-up" />
    <v-carousel
      v-else
      v-model="activeItem"
      :show-arrows="false">
      <carousel-item
        v-for="item in items"
        :key="item.id"
        @save="saveItem"
        :item="item"
        :embeds="embedsByItem[item.id]"
        :is-disabled="isDisabled" />
    </v-carousel>
  </div>
</template>

<script>
import CarouselItem from './CarouselItem';
import cloneDeep from 'lodash/cloneDeep';
import { ElementPlaceholder } from 'tce-core';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';

const DEFAULT_HEIGHT = 500;
const getIndices = obj => map(obj, (val, key) => parseInt(key)).sort().reverse();

export default {
  name: 'tce-carousel',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    isFocused: { type: Boolean, required: true },
    isDisabled: { type: Boolean, default: false }
  },
  data() {
    return {
      activeItem: 0
    };
  },
  computed: {
    height: vm => vm.element.data.height,
    items: vm => vm.element.data.items || {},
    hasItems: vm => !isEmpty(vm.items),
    embeds: vm => vm.element.data.embeds || {},
    embedsByItem() {
      return reduce(this.items, (acc, item) => {
        acc[item.id] = pick(this.embeds, Object.keys(item.body));
        return acc;
      }, {});
    }
  },
  methods: {
    saveItem({ item, embeds = {} }) {
      const items = cloneDeep(this.items);
      items[item.id] = item;
      this.$emit('save', {
        items,
        embeds: Object.assign(cloneDeep(this.embeds), embeds)
      });
    },
    deleteItem(index) {
      const indices = getIndices(this.items);
      const itemId = indices[index];
      const items = { ...this.items };
      const embeds = { ...this.embeds };
      const removedEmbeds = Object.keys(get(items[itemId], 'body', {}));
      delete items[itemId];
      this.$emit('save', { items, embeds: omit(embeds, removedEmbeds) });
      this.activateItem(index > 0 ? index - 1 : 0);
    },
    activateItem(index) {
      this.activeItem = index;
    }
  },
  mounted() {
    this.$elementBus.on('add', () => {
      const element = cloneDeep(this.element);
      const indices = getIndices(this.items) || [];
      const id = this.hasItems ? indices[0] + 1 : 1;
      if (!element.data.items) {
        Object.assign(element.data, {
          embeds: {}, items: {}, height: DEFAULT_HEIGHT
        });
      }
      element.data.items[id] = { id, body: {} };
      this.$emit('save', element.data);
      this.activateItem(indices.length);
    });
    this.$elementBus.on('remove', () => this.deleteItem(this.activeItem));
    this.$elementBus.on('height', height => {
      const data = cloneDeep(this.element.data);
      data.height = height;
      this.$emit('save', data);
    });
  },
  components: { CarouselItem, ElementPlaceholder }
};
</script>

<style lang="scss" scoped>
.tce-carousel {
  overflow: hidden;
}
</style>
