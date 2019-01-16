<template>
  <div
    class="popover left fade in element-selection-popover"
    role="tooltip">
    <div class="arrow"></div>
    <div class="popover-content">
      <slot/>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.element-selection-popover {
  top: -30px;
  left: -600px;
  display: block;
  max-width: 600px;
  width: 600px;
  text-align: center;
  color: #444;
  font-family: inherit;

  .arrow {
    top: 45px;
  }
}
</style>
