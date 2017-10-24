<template>
  <svg
    :width="`${width}px`"
    :height="`${height}px`"
    class="circular-progress"
    viewBox="0 0 66 66">
    <circle class="path" cx="33" cy="33" r="30"></circle>
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
$offset: 187;
$duration: 1.45s;

.circular-progress {
  animation: rotator $duration linear infinite;
}

.path {
  fill: none;
  stroke: #888;
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: $offset;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: dash $duration ease-in-out infinite;
}

@keyframes rotator {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(270deg); }
}

@keyframes dash {
  0% { stroke-dashoffset: $offset; }
  50% {
    stroke-dashoffset: $offset/4;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: $offset;
    transform: rotate(450deg);
  }
}
</style>




