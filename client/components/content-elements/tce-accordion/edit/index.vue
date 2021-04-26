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
    <v-expansion-panels multiple tile hover>
      <element-placeholder
        v-if="!hasItems"
        :is-focused="isFocused"
        :is-disabled="isDisabled"
        name="Accordion component"
        icon="mdi-view-list"
        active-placeholder="Click the button below to create the first item"
        active-icon="mdi-arrow-down" />
      <template v-else>
        <accordion-item
          v-for="it in items"
          :key="it.id"
          @save="saveItem"
          @delete="deleteItem"
          :item="it"
          :embeds="embedsByItem[it.id]"
          :is-disabled="isDisabled" />
      </template>
    </v-expansion-panels>
    <v-btn
      v-if="!isDisabled && (hasItems || isFocused)"
      @click="add"
      :class="{ 'mt-0': !hasItems && isFocused }"
      color="primary darken-3"
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
import { ElementPlaceholder } from '@tailor/core-components';
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
    isFocused: { type: Boolean, required: true },
    isDisabled: { type: Boolean, default: false }
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
  components: { AccordionItem, ElementPlaceholder }
};
</script>
