<template>
  <div @click="activateCell" class="table-cell">
    <primitive :initialElement="element" @save="saveBodyElement"></primitive>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import Primitive from '../Primitive';

export default {
  name: 'table-cell',
  props: ['cell', 'rowId', 'embeds', 'activeCell'],
  computed: {
    isActive() {
      return this.cell.id === this.activeCell;
    },
    element() {
      return this.embeds[Object.keys(this.cell.body)[0]];
    }
  },
  methods: {
    saveBodyElement(element) {
      if (this.cell.body && !this.cell.body[element.id]) return;
      element = cloneDeep(element);
      this.$emit('save', { element });
    },
    activateCell() {
      if (this.isActive) return;
      this.$emit('activateCell', this.cell.id);
    }
  },
  components: {
    Primitive
  }
};
</script>

<style lang="scss" scoped>
.table-cell {
  display: table-cell;
  width: 312px;
  max-width: 312px;
  height: 100%;
  border: 1px solid black;
}
</style>

<style lang="scss">
.table-cell {
  .te-container {
    height: 100% !important;
    padding: 0 !important;

    .teaching-element {
      height: 100% !important;
      padding: 0 !important;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>
