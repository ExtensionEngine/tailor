<template>
  <div class="tce-accordion">
    <v-chip
      v-if="hasItems"
      class="ma-2"
      color="grey darken-1"
      text-color="white">
      <v-avatar left>
        <v-icon>mdi-chevron-down</v-icon>
      </v-avatar>
      Accordion
      <v-avatar right>
        <v-icon>mdi-chevron-up</v-icon>
      </v-avatar>
    </v-chip>
    <v-sheet v-if="!hasItems" class="pa-12">
      <v-avatar size="60" color="blue-grey darken-4">
        <v-icon :size="isFocused ? 38 : 30" color="white">mdi-expand-all-outline</v-icon>
      </v-avatar>
      <div class="headline my-4">Accordion component</div>
      <div class="subtitle-1">
        <template v-if="!isFocused">Select to edit</template>
        <template v-else>
          Use toolbar
          <v-icon size="22" color="secondary">mdi-transfer-up</v-icon>
          to add first slide to carousel
        </template>
      </div>
    </v-sheet>
    <v-expansion-panels>
      <v-expansion-panel
        v-for="(item,i) in items"
        :key="i">
        <accordion-item
          @save="saveItem"
          @delete="deleteItem"
          :item="item"
          :embeds="embedsByItem[item.id]" />
      </v-expansion-panel>
    </v-expansion-panels>
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
    },
    isFocused() {
      return get(this.$attrs, 'is-focused', false);
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
