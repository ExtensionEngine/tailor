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
      teChannel.emit('addRowBefore', this.element.data.rowId);
    },
    addRowAfter() {
      teChannel.emit('addRowAfter', this.element.data.rowId);
    },
    addColBefore() {
      teChannel.emit('addColBefore', this.element.data.rowId, this.element.data.cellId);
    },
    addColAfter() {
      teChannel.emit('addColAfter', this.element.data.rowId, this.element.data.cellId);
    },
    removeRow() {
      teChannel.emit('removeRow', this.element.data.rowId);
    },
    removeColumn() {
      teChannel.emit('removeColumn', this.element.data.rowId, this.element.data.cellId);
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
