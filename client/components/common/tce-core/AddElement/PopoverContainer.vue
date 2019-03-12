<template>
  <div :class="{ opened }" class="insert-element">
    <div @click="$emit('toggle')" class="add-element-line"></div>
    <div class="add-element-wrapper">
      <slot name="toggle"/>
    </div>
    <transition name="fade">
      <div class="popover bottom element-selection-popover" role="tooltip">
        <div class="arrow"></div>
        <div class="popover-content">
          <slot name="selection"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    opened: { type: Boolean, default: false }
  }
};
</script>

<style lang="scss" scoped>
.add-element.insert-element {
  position: relative;
  width: 100%;
  margin: 0;
  padding: 5px 0;
  opacity: 0;
  transition: opacity 0.8s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &.opened {
    opacity: 1;

    .add-element-wrapper {
      z-index: 100;
    }

    .popover {
      display: block;
    }
  }

  .add-element-line {
    width: 100%;
    height: 2px;
    background-color: #42b983;
    cursor: pointer;
  }

  .add-element-wrapper {
    position: relative;
    z-index: 1;

    /deep/ .btn-base {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      background-color: white;
      font-size: 22px;
      line-height: 22px;
    }
  }
}

.element-selection-popover {
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: none;
  max-width: 600px;
  width: 600px;
  text-align: center;
  color: #444;
  font-family: inherit;
}
</style>
