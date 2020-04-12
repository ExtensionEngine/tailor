<template>
  <div class="tce-accordion">
    <v-toolbar
      v-if="hasItems"
      height="32"
      color="grey darken-3"
      dark
      class="text-left elevation-5">
      <span class="subtitle-2 mr-4">Accordion</span>
      <span>Click on the item to expand</span>
    </v-toolbar>
    <v-expansion-panels
      multiple tile hover
      class="tce-accordion">
      <v-sheet v-if="!hasItems" class="pt-4 px-12">
        <v-avatar size="60" color="blue-grey darken-4">
          <v-icon :size="isFocused ? 38 : 30" dark>mdi-view-list</v-icon>
        </v-avatar>
        <div class="headline my-4">Accordion component</div>
        <div v-if="isFocused" class="subtitle-1">
          Click button bellow
          <v-icon
            size="24"
            color="secondary"
            class="mdi-rotate-180">
            mdi-transfer-up
          </v-icon>
          to create the first item
        </div>
        <div v-else class="subtitle-1 pb-4">Select to edit</div>
      </v-sheet>
      <template v-else>
        <accordion-item
          v-for="it in items"
          :key="it.id"
          @save="saveItem"
          @delete="deleteItem"
          :item="it"
          :embeds="embedsByItem[it.id]" />
      </template>
    </v-expansion-panels>
    <v-btn
      v-if="hasItems || isFocused"
      @click="add"
      color="blue-grey darken-3"
      text
      class="my-6">
      <v-icon class="mr-2">mdi-tab-plus</v-icon>
      Add new accordion item
    </v-btn>
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
    element: { type: Object, required: true },
    isFocused: { type: Boolean, required: true }
  },
  computed: {
    items: vm => get(vm.element, 'data.items', {}),
    embeds: vm => get(vm.element, 'data.embeds', {}),
    hasItems: vm => !isEmpty(vm.items),
    embedsByItem() {
      return reduce(this.items, (acc, item) => {
        acc[item.id] = pick(this.embeds, Object.keys(item.body));
        return acc;
      }, {});
    }
  },
  methods: {
    add() {
      const id = cuid();
      const element = cloneDeep(this.element);
      element.data.items[id] = { id, header: 'Header', body: {} };
      this.$emit('save', element.data);
    },
    saveItem({ item, embeds = {} }) {
      const items = cloneDeep(this.items);
      items[item.id] = item;
      this.$emit('save', {
        items,
        embeds: { ...this.embeds, ...embeds }
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
  components: { AccordionItem }
};
</script>
