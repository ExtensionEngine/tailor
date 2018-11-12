<template>
  <div id="tableToolbar" class="table-toolbar">
    <span class="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown">
      <span class="mdi mdi-table"></span>
      Table
    </span>
    <ul class="dropdown-menu" role="menu">
      <li
        v-for="action in actions"
        :key="action.name"
        :disabled="!isCell"
        @click="trigger(action.name)"
        class="btn btn-link btn-sm">
        {{ action.label }}
      </li>
    </ul>
    <div v-if="isCell" class="quill-options">
      <span class="quill-group">
        <span class="ql-formats">
          <button class="ql-bold"></button>
          <button class="ql-italic"></button>
          <button class="ql-underline"></button>
        </span>
      </span>
      <span class="quill-group">
        <span class="ql-formats">
          <button class="ql-link" type="button"></button>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import EventBus from 'EventBus';

const teChannel = EventBus.channel('te');

const actions = [
  { name: 'addRowBefore', label: 'Add row before' },
  { name: 'addRowAfter', label: 'Add row after' },
  { name: 'addColumnBefore', label: 'Add column before' },
  { name: 'addColumnAfter', label: 'Add column after' },
  { name: 'removeRow', label: 'Delete row' },
  { name: 'removeColumn', label: 'Delete column' }
];

export default {
  name: 'table-toolbar',
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      actions
    };
  },
  computed: {
    isCell() {
      return this.element.type === 'TABLE-CELL';
    }
  },
  methods: {
    trigger(action) {
      this[action]();
    }
  },
  mounted() {
    actions.forEach(action => {
      this[action.name] = () => {
        const { tableId, cellId } = this.element.data;
        teChannel.emit(`${tableId}/${action.name}`, cellId);
      };
    });
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

  > * {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 10px;
  }

  .dropdown-toggle {
    margin-left: 10px;
    padding-top: 15px;
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
    height: 100%;
    padding-top: 13px;
  }

  .quill-group {
    padding-left: 5px;
  }

  .dropdown-menu {
    height: auto;
    margin-left: 10px;
    padding: 5px 0;

    li {
      display: block;
    }

    .btn {
      padding: 10px 12px;
      text-align: left;
    }
  }
}

.table-toolbar.ql-toolbar.ql-snow {
  padding: 0;
  border: none;
  font-family: inherit;
}
</style>
