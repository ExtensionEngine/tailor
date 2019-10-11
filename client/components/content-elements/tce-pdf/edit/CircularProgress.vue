<template>
  <svg
    :width="`${width}px`"
    :height="`${height}px`"
    class="circular-progress"
    viewBox="25 25 50 50">
    <circle class="path" cx="50" cy="50" r="20"></circle>
  </svg>
</template>

<script>
export default {
  name: 'circular-progress',
  props: {
    height: { type: Number, default: 40 },
    width: { type: Number, default: 40 }
  }
};
</script>

<style lang="scss" scoped>
.circular-progress {
  animation: rotate 1.4s linear infinite;
  stroke-dasharray: 125.664;
  stroke-dashoffset: 125.664px;
}

.path {
  fill: none;
  stroke: #888;
  stroke-dasharray: 80, 200;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  stroke-width: 5;
  transform-origin: center;
  animation: dash 1.4s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -15px;
    stroke: #337ab7;
  }

  100% {
    stroke-dasharray: 100, 200;
    stroke-dashoffset: -125px;
  }
}
</style>
