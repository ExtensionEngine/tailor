<template>
  <div>
    <v-alert v-if="!hasItems" type="info">
      Use the toolbar to add the first item to the carousel.
    </v-alert>
    <v-carousel
      v-else
      :show-arrows="false">
      <v-carousel-item
        v-for="(item,i) in items"
        :key="i">
        <carousel-item
          @save="saveItem"
          @delete="deleteItem"
          :item="item"
          :embeds="embedsByItem[item.id]"
          :active-item="activeItem" />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>

<script>
import CarouselItem from './CarouselItem';
import cloneDeep from 'lodash/cloneDeep';
import find from 'lodash/find';
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
    element: { type: Object, required: true }
  },
  data() {
    const indices = getIndices(this.element.data.items || {});
    return {
      activeItem: indices.length ? indices[indices.length - 1] : null
    };
  },
  computed: {
    items() {
      return this.element.data.items || {};
    },
    embeds() {
      return this.element.data.embeds || {};
    },
    embedsByItem() {
      return reduce(this.items, (acc, item) => {
        acc[item.id] = pick(this.embeds, Object.keys(item.body));
        return acc;
      }, {});
    },
    hasItems() {
      return !isEmpty(this.items);
    },
    height() {
      return this.element.data.height;
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
    deleteItem(itemId) {
      const items = cloneDeep(this.items);
      const embeds = cloneDeep(this.embeds);
      const removedEmbeds = Object.keys(items[itemId].body);
      delete items[itemId];
      this.$emit('save', { items, embeds: omit(embeds, removedEmbeds) });
      const indices = getIndices(items);
      const previousId = indices.length
        ? find(indices, it => it < itemId) || indices[indices.length - 1]
        : null;
      if (previousId) this.activateItem({ id: previousId });
    },
    activateItem(item) {
      this.activeItem = item.id;
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
      this.activateItem({ id });
    });
    this.$elementBus.on('remove', () => this.deleteItem(this.activeItem));
    this.$elementBus.on('height', height => {
      const data = cloneDeep(this.element.data);
      data.height = height;
      this.$emit('save', data);
    });
  },
  components: { CarouselItem }
};
</script>
