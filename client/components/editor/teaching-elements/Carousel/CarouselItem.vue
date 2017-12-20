<template>
  <li :class="{ 'active': isActive }" class="container-fluid carousel-item">
    <div v-if="!hasElements" class="well">
      Click the button below to Create your first teaching element.
    </div>
    <draggable
      :list="elements"
      :options="dragOptions"
      @update="reorder"
      class="row">
      <primitive
        v-for="element in elements"
        :key="element.id"
        :initialElement="element"
        @save="saveBodyElement">
      </primitive>
    </draggable>
    <add-element v-if="!hasElements"
      :include="['HTML', 'IMAGE']"
      :layout="false"
      @add="addElement"
      class="add-element">
    </add-element>
  </li>
</template>

<script>
import AddElement from '../../structure/AddElement';
import calculatePosition from 'utils/calculatePosition.js';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import Primitive from '../Primitive';
import toArray from 'lodash/toArray';

export default {
  name: 'carousel-item',
  props: ['item', 'embeds', 'activeItem'],
  data() {
    return {
      dragOptions: { handle: '.embed-drag-handle' }
    };
  },
  computed: {
    isActive() {
      return this.item.id === this.activeItem;
    },
    elements() {
      return toArray(pick(this.embeds, Object.keys(this.item.body)))
        .sort((a, b) => a.position - b.position);
    },
    hasElements() {
      return !isEmpty(this.item.body);
    }
  },
  methods: {
    reorder({ newIndex: newPosition }) {
      const items = cloneDeep(this.elements);
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      const newElementPosition = calculatePosition(context);
      const element = cloneDeep(items[newPosition]);
      element.position = newElementPosition;
      this.$emit('save', { element });
    },
    toggle() {
      this.isActive = !this.isActive;
    },
    saveBodyElement(element) {
      if (this.item.body && !this.item.body[element.id]) return;
      element = cloneDeep(element);
      this.$emit('save', { element });
    },
    addElement(element) {
      let item = cloneDeep(this.item);
      item.body[element.id] = true;
      element = cloneDeep(element);
      element.position = Object.keys(item.body).length;
      this.$emit('save', { item, element });
    }
  },
  components: {
    AddElement,
    Draggable,
    Primitive
  }
};
</script>

<style lang="scss" scoped>
.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: inherit;
  opacity: 0;
  z-index: 1;
  overflow-y: auto;
  transition: opacity 300ms cubic-bezier(0.165, 0.84, 0.44, 1);

  .mdi {
    color: #707070;
    font-size: 22px;

    &:hover {
      color: #444;
      cursor: pointer;
    }
  }
}

.active {
  opacity: 1;
  z-index: 2;
}

.disabled .add-element {
  display: none;
}
</style>
