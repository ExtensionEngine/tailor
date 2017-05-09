<template>
  <div id="tableToolbar" class="table-toolbar">
    <ul>
      <li class="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown">
        <span class="mdi mdi-table"></span>
        Table
      </li>
      <ul class="dropdown-menu" role="menu">
        <li @click="addRowBefore" :disabled="!isCell" class="btn btn-link btn-sm">
          Add row before
        </li>
        <li @click="addRowAfter" :disabled="!isCell" class="btn btn-link btn-sm">
          Add row after
        </li>
        <li @click="addColBefore" :disabled="!isCell" class="btn btn-link btn-sm">
          Add column before
        </li>
        <li @click="addColAfter" :disabled="!isCell" class="btn btn-link btn-sm">
          Add column after
        </li>
        <li class="divider"></li>
        <li @click="removeRow" :disabled="!isCell" class="btn btn-link btn-sm">
          Delete row
        </li>
        <li @click="removeColumn" :disabled="!isCell" class="btn btn-link btn-sm">
          Delete column
        </li>
      </ul>
      <div v-if="isCell" class="quill-options">
        <li class="quill-group">
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
          </span>
        </li>
        <li class="quill-group">
          <span class="ql-formats">
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
          </span>
        </li>
        <li class="quill-group">
          <span class="ql-formats">
            <button class="ql-link" type="button"></button>
          </span>
        </li>
      </div>
    </ul>
  </div>
</template>

<script>
import EventBus from 'EventBus';

const teChannel = EventBus.channel('te');

export default {
  name: 'table-toolbar',
  props: ['element'],
  computed: {
    isCell() {
      return this.element.type === 'TABLE-CELL';
    }
  },
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
      display: inline-block;
      height: 100%;
      padding-top: 15px;
      vertical-align: middle;
      color: #444;

      .mdi {
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }

    .quill-options {
      display: inline-block;
      height: 100%;
    }

    .quill-group {
      padding-left: 15px;
    }
  }

  .dropdown-menu {
    height: auto;
    margin-left: 10px;
    padding: 5px 0;

    li {
      display: block;
    }

    .btn {
      padding-left: 20px;
      text-align: left;
      text-transform: none;
      font-size: 14px;
    }

    .divider {
      height: 1px;
      padding: 0;
    }
  }
}
.table-toolbar.ql-toolbar.ql-snow {
  padding: 0 !important;
  border: none !important;
  font-family: Catamaran, Helvetica, Arial, sans-serif !important;
}
</style>
