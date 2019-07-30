<template>
  <div class="tce-accordion">
    <div v-if="!hasItems" class="well">
      Use the toolbar to add the first item to the accordion.
    </div>
    <ul v-else class="accordion">
      <accordion-item
        v-for="it in items"
        :key="it.id"
        @save="saveItem"
        @delete="deleteItem"
        :item="it"
        :embeds="embedsByItem[it.id]" />
    </ul>
  </div>
</template>

<script>
import AccordionItem from './AccordionItem';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import reduce from 'lodash/reduce';

export default {
  name: 'tce-accordion',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  computed: {
    items() {
      return get(this.element, 'data.items', {});
    },
    embeds() {
      return get(this.element, 'data.embeds', {});
    },
    hasItems() {
      return !isEmpty(this.items);
    },
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
    deleteItem(itemId) {
      const items = cloneDeep(this.items);
      const embeds = cloneDeep(this.embeds);
      const removedEmbeds = Object.keys(items[itemId].body);
      delete items[itemId];
      this.$emit('save', { items, embeds: omit(embeds, removedEmbeds) });
    }
  },
  created() {
    this.$elementBus.on('add', () => {
      const id = cuid();
      const element = cloneDeep(this.element);
      element.data.items[id] = { id, header: 'Header', body: {} };
      this.$emit('save', element.data);
    });
  },
  components: { AccordionItem }
};
</script>

<style lang="scss" scoped>
.accordion {
  margin: 0;
  padding-left: 0;
  border: 1px solid #ddd;
  border-bottom: none;
  list-style-type: none;
}
</style>
