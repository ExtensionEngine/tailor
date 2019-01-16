<template>
  <div
    :class="{ show }"
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
  width: 100%;
  opacity: 0;
  transition: opacity 0.6s;

  &.show {
    opacity: 1;
  }

  .add-element-wrapper {
    position: relative;
    width: 100%;
    height: 3px;
    background-color: $main-color;

    .add-element {
      position: absolute;
      top: -13px;
      right: -27px;
      margin: 0;
      color: $main-color;
    }
  }
}
</style>
