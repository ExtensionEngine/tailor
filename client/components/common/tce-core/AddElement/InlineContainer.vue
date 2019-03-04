<template>
  <transition name="slide-fade">
    <div class="selections">
      <slot/>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.selections {
  min-height: 85px;
  margin-top: 10px;
}

.slide-fade-enter-active {
  transition: all 0.2s ease-in-out;
}

.slide-fade-enter {
  transform: translateY(-30px);
}

.slide-fade-leave-to, .slide-fade-leave-active {
  display: none;
}
</style>
