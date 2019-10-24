<template>
  <content-element
    @save="save"
    :element="cell"
    :parent="table"
    :frame="false"
    :show-placeholder="false"
    class="table-cell" />
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

  /deep/ {
    .ql-editor {
      min-height: 24px;
      word-break: break-all;
    }

    .ql-blank::before {
      content: '';
    }
  }
}
</style>
