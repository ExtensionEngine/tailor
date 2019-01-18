<template>
  <div
    :class="{ show, opened }"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
    class="insert-element">
    <div class="add-element-wrapper">
      <add-element
        :include="include"
        :activity="activity"
        :position="position"
        :layout="layout"
        :popover="true"
        @add="el => $emit('add', el)"
        @opened="opened = true"
        @closed="onClose"/>
    </div>
  </div>
</template>

<script>
import AddElement from './AddElement';

export default {
  props: {
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null }
  },
  data() {
    return {
      hovering: false,
      opened: false
    };
  },
  computed: {
    show() {
      return this.hovering || this.opened;
    }
  },
  methods: {
    onClose(fully = false) {
      this.opened = false;
      if (fully) this.hovering = false;
    }
  },
  components: {
    AddElement
  }
};
</script>

<style lang="scss" scoped>
$main-color: #337ab7;

.insert-element {
  position: relative;
  width: 100%;
  padding: 5px 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;

  &.show {
    opacity: 1;
  }

  &.opened {
    .add-element-wrapper {
      z-index: 2;
    }
  }

  .add-element-wrapper {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 2px;
    background-color: $main-color;

    .add-element {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      background-color: white;

      /deep/ .btn-base {
        font-size: 22px;
        line-height: 22px;
      }
    }
  }
}
</style>
