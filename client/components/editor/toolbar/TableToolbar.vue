<template>
  <div id="tableToolbar" class="table-toolbar">
    <ul>
      <li @click="addRowBefore" class="btn btn-link btn-sm">
        <span class="mdi mdi-table-row-plus-before"></span>
        Add row before
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
  computed: {
    id() {
      return this.element._cid || this.element.id;
    }
  },
  methods: {
    addRowBefore() {
      // TODO(marko): this `id` is the `id` of the HtmlTable component in most
      // cases instead of the Table component. Fix this.
      teChannel.emit(`${this.id}/addRowBefore`, this.element.data.rowId);
    },
    addRowAfter() {
      teChannel.emit(`${this.id}/addRowAfter`);
    },
    addColBefore() {
      teChannel.emit(`${this.id}/addColBefore`);
    },
    addColAfter() {
      teChannel.emit(`${this.id}/addColAfter`);
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
