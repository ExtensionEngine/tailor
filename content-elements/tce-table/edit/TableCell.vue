<template>
  <div class="table-cell">
    <div class="cell-editor col-xs-12">
      <content-element
        :element="processedElement"
        :parent="table"
        :frame="false"
        :showPlaceholder="false"
        @save="save"/>
    </div>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { ContentElement } from 'tce-core';

export default {
  name: 'table-cell',
  props: {
    cell: { type: Object, required: true },
    table: { type: Object, required: true },
    disabled: { type: Boolean, default: false }
  },
  data() {
    return { isFocused: false };
  },
  computed: {
    processedElement() {
      // Override type due to legacy format
      return { ...this.cell, type: 'HTML' };
    }
  },
  methods: {
    save(data) {
      this.$emit('save', { ...cloneDeep(this.cell), data });
    }
  },
  components: { ContentElement }
};
</script>

<style lang="scss" scoped>
.table-cell {
  display: table-cell;
  width: 312px;
  max-width: 312px;
  height: 100%;
  border: 1px solid black;

  .cell-editor {
    height: 100%;
    padding: 0;
  }
}
</style>

<style lang="scss">
.cell-editor {
  .ql-editor {
    min-height: 42px;
  }

  .ql-container.ql-snow {
    border: none !important;
  }
}
</style>
