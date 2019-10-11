<template>
  <div class="tce-table-toolbar">
    <span class="btn btn-link btn-sm dropdown-toggle" data-toggle="dropdown">
      <span class="mdi mdi-table"></span>
      Table
    </span>
    <ul class="dropdown-menu" role="menu">
      <li
        v-for="action in actions"
        :key="action.name"
        @click="trigger(action.name)"
        class="btn btn-link btn-sm">
        {{ action.label }}
      </li>
    </ul>
  </div>
</template>

<script>
const actions = () => [
  { name: 'addRowBefore', label: 'Add row before' },
  { name: 'addRowAfter', label: 'Add row after' },
  { name: 'addColumnBefore', label: 'Add column before' },
  { name: 'addColumnAfter', label: 'Add column after' },
  { name: 'removeRow', label: 'Delete row' },
  { name: 'removeColumn', label: 'Delete column' }
];

export default {
  name: 'tce-table-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true },
    embed: { type: Object, default: null }
  },
  computed: { actions },
  methods: {
    trigger(action) {
      this.$elementBus.emit(action, this.embed.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-table-toolbar {
  position: relative;
  width: 100%;
  height: 48px;

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

.tce-table-toolbar.ql-toolbar.ql-snow {
  padding: 0;
  border: none;
  font-family: inherit;
}
</style>
