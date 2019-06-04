<template>
  <div class="tce-accordion-toolbar">
    <ul>
      <li @click="add" class="btn btn-link btn-sm">
        <span class="mdi mdi-plus"></span> Add item
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'tce-accordion-toolbar',
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  methods: {
    add() {
      this.$elementBus.emit('add');
    }
  }
};
</script>

<style lang="scss" scoped>
.tce-accordion-toolbar {
  position: relative;
  width: 100%;
  height: 48px;

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
</style>
