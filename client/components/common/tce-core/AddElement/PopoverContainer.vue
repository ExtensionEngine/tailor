<template>
  <transition name="fade">
    <div class="popover bottom element-selection-popover" role="tooltip">
      <div class="arrow"></div>
      <div class="popover-content">
        <slot/>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.element-selection-popover {
  top: 25px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  max-width: 600px;
  width: 600px;
  text-align: center;
  color: #444;
  font-family: inherit;
}
</style>
