<template>
  <div>
    <slot name="toggle"/>
    <transition name="slide">
      <div class="selections">
        <slot name="selection"/>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.selections {
  min-height: 85px;
  margin-top: 10px;
}

.slide-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-enter {
  transform: translateY(-30px);
}

.slide-leave-to, .slide-leave-active {
  display: none;
}
</style>
