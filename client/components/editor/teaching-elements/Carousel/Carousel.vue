<template>
  <div v-if="!hasItems" class="well">
    Use the toolbar to add the first item to the carousel.
  </div>
  <div v-else :style="{ height: height + 'px' }" class="carousel">
    <ul :style="{ height: height - 40 + 'px' }" class="carousel-items">
      <carousel-item
        v-for="it in items"
        :key="it.id"
        :item="it"
        :embeds="embeds"
        :activeItem="activeItem"
        @save="saveItem"
        @delete="deleteItem">
      </carousel-item>
    </ul>
    <ul class="indicators">
      <li
        v-for="it in items"
        :key="it.id"
        :class="{ 'active': activeItem === it.id }"
        @click="activateItem(it)"
        class="indicator-item"/>
    </ul>
  </div>
</template>

<script>
import CarouselItem from './CarouselItem';
import cloneDeep from 'lodash/cloneDeep';
import EventBus from 'EventBus';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import { mapActions } from 'vuex-module';
import omit from 'lodash/omit';

const appChannel = EventBus.channel('app');
const teChannel = EventBus.channel('te');
const DEFAULT_HEIGHT = 500;

let getIndices = obj => map(Object.keys(obj), it => parseInt(it)).sort().reverse();

export default {
  name: 'te-carousel',
  props: ['element'],
  data() {
    let indices = getIndices(this.element.data.items || {});
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
    hasItems() {
      return !isEmpty(this.items);
    },
    height() {
      return this.element.data.height;
    }
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    saveItem({ item, element }) {
      let embeds = this.embeds;
      let items = this.items;

      if (element) {
        embeds = cloneDeep(this.embeds);
        embeds[element.id] = element;
      }

      if (item) {
        items = cloneDeep(this.items);
        items[item.id] = item;
      }

      this.$emit('save', { embeds, items });
    },
    deleteItem(itemId) {
      let embeds = cloneDeep(this.embeds);
      let items = cloneDeep(this.items);
      embeds = omit(embeds, Object.keys(items[itemId].body));
      delete items[itemId];
      this.$emit('save', { embeds, items });

      let indices = getIndices(items);
      let previousId = indices.length
        ? find(indices, it => it < itemId) || indices[indices.length - 1]
        : null;
      if (previousId) this.activateItem({ id: previousId });
    },
    activateItem(item) {
      this.activeItem = item.id;
    }
  },
  mounted() {
    teChannel.on(`${this.element._cid}/add`, () => {
      const element = cloneDeep(this.element);
      const indices = getIndices(this.items) || [];
      const id = this.hasItems ? indices[0] + 1 : 1;

      if (!element.data.items) {
        element.data = { embeds: {}, items: {}, height: DEFAULT_HEIGHT };
      }

      element.data.items[id] = { id, body: {} };
      this.updateElement(element);
      this.activateItem({ id });
    });

    teChannel.on(`${this.element._cid}/remove`, () => {
      this.deleteItem(this.activeItem);
    });

    teChannel.on(`${this.element._cid}/height`, height => {
      const element = cloneDeep(this.element);
      element.data.height = height;
      this.updateElement(element);
    });

    appChannel.on('deleteElement', element => {
      if (!element.embedded || !this.embeds[element.id]) return;
      let embeds = cloneDeep(this.embeds);
      let items = cloneDeep(this.items);
      delete embeds[element.id];
      forEach(items, it => delete it.body[element.id]);
      this.$emit('save', { embeds, items });
    });
  },
  components: {
    CarouselItem
  }
};
</script>

<style lang="scss" scoped>
.carousel {
  position: relative;
  width: 100%;
}

.carousel-items {
  margin: 0;
  padding-left: 0;
  list-style-type: none;
}

.indicators {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 22px;
  margin: 0;
  padding-left: 0;
  text-align: center;
  list-style-type: none;

  .indicator-item {
    display: inline-block;
    position: relative;
    width: 16px;
    height: 16px;
    margin: 0 12px;
    background-color: #ddd;
    transition: background-color 0.3s;
    border-radius: 50%;
    cursor: pointer;

    &.active {
      background-color: #444;
    }
  }
}
</style>
