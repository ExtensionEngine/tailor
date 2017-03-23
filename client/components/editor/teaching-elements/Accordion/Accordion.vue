<template>
  <div v-if="!hasItems" class="well">
    Use the toolbar to add the first item to the accordion.
  </div>
  <ul v-else class="accordion">
    <accordion-item
      v-for="it in items"
      :item="it"
      @save="saveItem"
      @delete="deleteItem">
    </accordion-item>
  </ul>
</template>

<script>
import AccordionItem from './AccordionItem';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import EventBus from 'EventBus';
import isEmpty from 'lodash/isEmpty';
import { mapActions } from 'vuex-module';

const teChannel = EventBus.channel('te');

export default {
  name: 'te-accordion',
  props: ['element'],
  computed: {
    items() {
      return this.element.data.items || {};
    },
    hasItems() {
      return !isEmpty(this.items);
    }
  },
  methods: {
    ...mapActions({ updateElement: 'update' }, 'tes'),
    saveItem(item) {
      const items = cloneDeep(this.items);
      items[item.id] = item;
      this.$emit('save', { items });
    },
    deleteItem(itemId) {
      const items = cloneDeep(this.items);
      delete items[itemId];
      this.$emit('save', { items });
    }
  },
  created() {
    teChannel.on(`${this.element._cid}/add`, () => {
      const element = cloneDeep(this.element);
      element.data.items = element.data.items || {};
      const id = cuid();
      element.data.items[id] = { id, header: 'Header', body: {} };
      this.updateElement(element);
    });
  },
  components: {
    AccordionItem
  }
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
