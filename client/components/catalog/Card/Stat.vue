<template>
  <span>
    <div class="stat-name">{{ name }}</div>
    <span class="stat-value">{{ value }}</span>
  </span>
</template>

<script>
export default {
  props: ['name', 'value']
};
</script>

<style lang="scss" scoped>
.stat-name {
  color: #888;
  font-size: 14px;
}

.stat-value {
  color: #555;
  font-size: 20px;
}
</style>
