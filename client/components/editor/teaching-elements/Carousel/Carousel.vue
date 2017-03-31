<template>
  <div v-if="!hasItems" class="well">
    Use the toolbar to add the first item to the carousel.
  </div>
  <div v-else class="carousel">
    <ul class="carousel-items">
      <carousel-item
        v-for="it in items"
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
        :class="{ 'active': activeItem === it.id }"
        @click="activateItem(it)"
        class="indicator-item"/>
    </ul>
  </div>
</template>

<script>
import CarouselItem from './CarouselItem';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import EventBus from 'EventBus';
import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import { mapActions } from 'vuex-module';
import omit from 'lodash/omit';

const appChannel = EventBus.channel('app');
const teChannel = EventBus.channel('te');

function getInitialActiveItem(element) {
  const items = element.data.items || {};
  const hasItems = !isEmpty(items);

  // TODO(marko): Replace items with an ordered map (or an array), so we can
  //  easily get first item in it (the one which was inserted first)
  return hasItems ? items[Object.keys(items)[0]].id : null;
}

export default {
  name: 'te-carousel',
  props: ['element'],
  data() {
    return {
      activeItem: getInitialActiveItem(this.element)
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
    }
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    saveItem({ item, element }) {
      let embeds = this.embeds;
      if (element) {
        embeds = cloneDeep(this.embeds);
        embeds[element.id] = element;
      }
      let items = this.items;
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
    },
    activateItem(item) {
      this.activeItem = item.id;
    }
  },
  created() {
    teChannel.on(`${this.element._cid}/add`, () => {
      const element = cloneDeep(this.element);
      if (!element.data.items) {
        element.data.items = {};
        element.data.embeds = {};
      }
      const id = cuid();
      element.data.items[id] = { id, body: {} };
      this.updateElement(element);
      this.activateItem(element.data.items[id]);
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
  height: 500px;
}

.carousel-items {
  height: 460px;
  margin: 0;
  padding-left: 0;
  list-style-type: none;
}

.indicators {
  position: absolute;
  height: 22px;
  left: 0;
  right: 0;
  bottom: 0;
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
    transition: background-color .3s;
    border-radius: 50%;
    cursor: pointer;

    &.active {
      background-color: #000;
    }
  }
}
</style>
