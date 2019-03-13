<template>
  <div :class="{ opened }" class="insert-element">
    <div @click="$emit('toggle')" class="add-element-line"></div>
    <div class="add-element-wrapper">
      <slot name="toggle"/>
    </div>
    <transition name="fade">
      <div class="popover bottom element-selection-popover" role="tooltip">
        <div class="arrow"></div>
        <div class="popover-content element-selection-popover-content">
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
  transition: opacity 0.8s ease-in-out, margin 0.2s ease-in-out;

  &:hover {
    opacity: 1;
  }

  &.opened {
    margin: 2px 0;
    opacity: 1;

    .add-element-line {
      height: 3px;
    }

    .add-element-wrapper {
      z-index: 100;

      /deep/ .toggle-btn {
        top: -15px;
        font-size: 28px;
        line-height: 28px;
      }
    }

    .element-selection-popover {
      display: block;
    }
  }

  .add-element-line {
    width: 100%;
    height: 2px;
    background-color: #42b983;
    cursor: pointer;
    transition: height 0.4s ease-in-out;
  }

  .add-element-wrapper {
    position: relative;
    z-index: 1;

    /deep/ .toggle-btn {
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      padding: 0 3px;
      color: #42b983;
      font-size: 24px;
      line-height: 24px;
      background-color: white;
    }
  }

  .element-selection-popover {
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    display: none;
    max-width: 650px;
    width: 650px;
    text-align: center;
    color: #444;
    font-family: inherit;
    border-radius: 20px;

    .element-selection-popover-content {
      padding: 9px;
    }

    /deep/ {
      .element-container {
        padding-bottom: 5px;

        &:last-child {
          padding: 0;
        }
      }

      .element-type {
        .mdi {
          padding-bottom: 4px;
          font-size: 28px;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }
}
</style>
