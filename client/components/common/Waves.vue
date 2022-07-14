<template>
  <svg
    :style="{ height }"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    shape-rendering="auto"
    class="waves">
    <defs>
      <path
        id="wave"
        d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z">
      </path>
    </defs>
    <g :class="{ slow }" class="inner-container">
      <use
        v-for="(wave, index) in waves"
        :key="index"
        :x="wave.x"
        :y="wave.y"
        :fill="wave.color"
        xlink:href="#wave">
      </use>
    </g>
  </svg>
</template>

<script>
export default {
  name: 'waves-preview',
  props: {
    color: { type: String, default: '255,255,255' },
    height: { type: String, default: '6rem' },
    slow: { type: Boolean, default: false }
  },
  computed: {
    waves: vm => {
      return [
        { y: 0, alpha: 0.025 },
        { y: 3, alpha: 0.075 },
        { y: 5, alpha: 0.05 },
        { y: 7, alpha: 0.025 }
      ].map(it => ({ ...it, x: 50, color: `rgba(${vm.color},${it.alpha})` }));
    }
  }
};
</script>

<style lang="scss" scoped>
.waves {
  position: relative;
  width: 100%;
}

@keyframes move-forever {
  0% { transform: translate3d(-90px, 0, 0); }
  100% { transform: translate3d(85px, 0, 0); }
}

@mixin waves($durations) {
  @for $index from 1 through length($durations) {
    use:nth-child(#{$index}) {
      animation-delay: -(1s + $index);
      animation-duration: nth($durations, $index);
    }
  }
}

.inner-container > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.inner-container > {
  $wave-durations: 7s, 10s, 13s, 20s;
  @include waves($wave-durations);
}

.inner-container.slow > {
  $wave-durations: 14s, 24s, 28s, 32s;
  @include waves($wave-durations);
}
</style>
