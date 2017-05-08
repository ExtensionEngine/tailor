<template>
  <div id="tableToolbar" class="table-toolbar">
    <ul>
      <li @click="addRowBefore" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-row-plus-before"></span>
        Add row before
      </li>
      <li @click="addRowAfter" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-row-plus-after"></span>
        Add row after
      </li>
      <li @click="addColBefore" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-column-plus-before"></span>
        Add column before
      </li>
      <li @click="addColAfter" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-column-plus-after"></span>
        Add column after
      </li>
      <li @click="removeRow" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-row-remove"></span>
        Delete row
      </li>
      <li @click="removeColumn" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-column-remove"></span>
        Delete column
      </li>
    </ul>
  </div>
</template>

<script>
import EventBus from 'EventBus';

const teChannel = EventBus.channel('te');

export default {
  name: 'table-toolbar',
  props: ['element'],
  methods: {
    addRowBefore() {
      const { tableId, rowId } = this.element.data;
      teChannel.emit(`${tableId}/addRowBefore`, rowId);
    },
    addRowAfter() {
      const { tableId, rowId } = this.element.data;
      teChannel.emit(`${tableId}/addRowAfter`, rowId);
    },
    addColBefore() {
      const { tableId, rowId, cellId } = this.element.data;
      teChannel.emit(`${tableId}/addColBefore`, rowId, cellId);
    },
    addColAfter() {
      const { tableId, rowId, cellId } = this.element.data;
      teChannel.emit(`${tableId}/addColAfter`, rowId, cellId);
    },
    removeRow() {
      const { tableId, rowId } = this.element.data;
      teChannel.emit(`${tableId}/removeRow`, rowId);
    },
    removeColumn() {
      const { tableId, rowId, cellId } = this.element.data;
      teChannel.emit(`${tableId}/removeColumn`, rowId, cellId);
    }
  }
};
</script>

<style lang="scss" scoped>
.table-toolbar {
  position: relative;
  width: 100%;
  height: 48px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  ul {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      padding-top: 15px;
      color: #444;

      .mdi {
        display: inline-block;
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }
  }
}
.table-toolbar.ql-toolbar.ql-snow {
  padding: 0 !important;
  border: none !important;
  font-family: Catamaran, Helvetica, Arial, sans-serif !important;
}
</style>
