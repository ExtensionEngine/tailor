<template>
  <div class="te-modal">
    <div v-if="isEditing" class="container-fluid">
      <div v-if="!hasElements" class="well">
        Click the button below to Create your first teaching element.
      </div>
      <draggable
        :list="embeds"
        :options="dragOptions"
        @update="reorder"
        class="row">
        <primitive
          v-for="it in embeds"
          :key="it.id"
          :initialElement="it"
          :drag="true"
          @save="saveItem">
        </primitive>
      </draggable>
      <add-element :include="['HTML', 'IMAGE']" @add="saveItem"></add-element>
    </div>
    <preview v-else :title="title" :elements="embeds"></preview>
  </div>
</template>

<script>
import AddElement from '../../structure/AddElement';
import calculatePosition from 'utils/calculatePosition';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import EventBus from 'EventBus';
import { mapActions } from 'vuex-module';
import Preview from './Preview';
import Primitive from '../Primitive';
import values from 'lodash/values';

const teChannel = EventBus.channel('te');

export default {
  name: 'te-modal',
  props: ['element'],
  data() {
    return {
      isEditing: false,
      dragOptions: { handle: '.drag-handle' }
    };
  },
  computed: {
    title() {
      return this.element.data.title || 'Open modal';
    },
    embeds() {
      const items = this.element.data.embeds;
      return items ? values(items).sort((a, b) => a.position - b.position) : [];
    },
    hasElements() {
      return this.embeds.length;
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    reorder({ newIndex: newPosition }) {
      const isFirstChild = newPosition === 0;
      const context = { items: this.embeds, newPosition, isFirstChild };
      const element = cloneDeep(this.element);
      let reordered = element.data.embeds[this.embeds[newPosition].id];
      reordered.position = calculatePosition(context);
      this.save(element);
    },
    saveItem(item) {
      let element = cloneDeep(this.element);
      item.position = this.embeds.length;
      element.data.embeds = element.data.embeds || {};
      element.data.embeds[item.id] = item;
      this.save(element);
    },
    deleteItem(item) {
      let element = cloneDeep(this.element);
      delete element.data.embeds[item.id];
      this.save(element);
    }
  },
  created() {
    teChannel.on(`${this.element._cid}/toggleEdit`, () => {
      this.isEditing = !this.isEditing;
    });
  },
  components: {
    AddElement,
    Draggable,
    Preview,
    Primitive
  }
};
</script>
