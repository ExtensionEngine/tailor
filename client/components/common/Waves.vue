<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    viewBox="0 24 150 28"
    preserveAspectRatio="none"
    shape-rendering="auto"
    class="waves">
    <defs>
      <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"></path>
    </defs>
    <g class="inner-container">
      <use xlink:href="#wave" x="48" y="0" fill="rgba(255,255,255,0.025"></use>
      <use xlink:href="#wave" x="48" y="3" fill="rgba(255,255,255,0.075)"></use>
      <use xlink:href="#wave" x="48" y="5" fill="rgba(255,255,255,0.05)"></use>
      <use xlink:href="#wave" x="48" y="7" fill="rgba(255,255,255,0.025)"></use>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.waves {
  position: relative;
  width: 100%;
  min-height: 6rem;
  max-height: 6rem;
}

.inner-container > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}

.inner-container > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.inner-container > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.inner-container > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.inner-container > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}
</style>
