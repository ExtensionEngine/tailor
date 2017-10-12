<template>
  <li>
    <div class="accordion-header">
      <div v-if="!isEditingHeader" @click="toggle" class="contents">
        <span class="title">{{ item.header }}</span>
        <span @click.stop="editHeader" class="mdi mdi-pencil edit-header"></span>
        <span @click.stop="deleteItem" class="mdi mdi-delete delete-item"></span>
      </div>
      <div v-else class="contents">
        <input v-model="header" class="form-control" type="text" placeholder="Header">
        <span @click.stop="saveHeader" class="mdi mdi-content-save"></span>
        <span @click.stop="isEditingHeader = false" class="mdi mdi-close"></span>
      </div>
    </div>
    <transition name="slide-fade">
      <div v-if="!isCollapsed" class="container-fluid accordion-body">
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
            :drag="true"
            @save="saveBodyElement">
          </primitive>
        </draggable>
        <add-element
          :include="['HTML', 'IMAGE']"
          :layout="true"
          @add="addElement"
          class="add-element">
        </add-element>
      </div>
    </transition>
  </li>
</template>

<script>
import AddElement from '../../structure/AddElement';
import calculatePosition from 'utils/calculatePosition.js';
import cloneDeep from 'lodash/cloneDeep';
import Draggable from 'vuedraggable';
import pick from 'lodash/pick';
import Primitive from '../Primitive';
import toArray from 'lodash/toArray';

export default {
  name: 'accordion-item',
  props: ['item', 'embeds'],
  data() {
    return {
      dragOptions: { handle: '.drag-handle' },
      header: this.item.header,
      isCollapsed: true,
      isEditingHeader: false
    };
  },
  computed: {
    elements() {
      return toArray(pick(this.embeds, Object.keys(this.item.body)))
        .sort((a, b) => a.position - b.position);
    },
    hasElements() {
      return !!this.elements.length;
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
      this.isCollapsed = !this.isCollapsed;
    },
    editHeader() {
      this.isEditingHeader = true;
      this.header = this.item.header;
    },
    saveHeader() {
      this.isEditingHeader = false;
      this.$emit('save', { item: { ...this.item, header: this.header } });
    },
    saveBodyElement(element) {
      if (this.item.body && !this.item.body[element.id]) return;
      this.$emit('save', { element: cloneDeep(element) });
    },
    addElement(element) {
      let item = cloneDeep(this.item);
      item.body[element.id] = true;
      element = cloneDeep(element);
      element.position = Object.keys(item.body).length;
      this.$emit('save', { item, element });
    },
    deleteItem() {
      this.$emit('delete', this.item.id);
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
.accordion-header {
  height: 60px;
  padding: 12px;
  font-size: 16px;
  border-bottom: 1px solid #ddd;
  text-align: justify;
  cursor: pointer;

  .contents {
    line-height: 34px;

    &:after {
      display: inline-block;
      width: 100%;
      content: '';
    }

    span {
      display: inline-block;
      vertical-align: middle;
      line-height: 1em;
    }

    .title {
      display: inline-block;
      width: 90%;
      max-width: 90%;
      padding-top: 1px;
      color: #555555;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .form-control {
      display: inline-block;
      width: 90%;
      outline-style: none;
    }

    .btn {
      display: inline-block;
      font-size: 11px;

      &:active {
        outline: none;
      }
    }

    .mdi {
      color: #707070;

      &:hover {
        color: #444;
      }
    }
  }
}

.accordion-body {
  height: auto;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  padding: 32px 8px;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  overflow: hidden;
  margin-top: 0;
  margin-bottom: 0;
  transition: all 350ms cubic-bezier(0.165, 0.84, 0.44, 1); // "easeOutQuart"
}

.slide-fade-enter, .slide-fade-leave-to {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

[disabled] {
  .accordion-header {
    .edit-header, .delete-item {
      display: none;
    }
  }

  .add-element {
    display: none;
  }
}
</style>
