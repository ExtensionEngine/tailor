<template>
  <div class="select-width">
    <div
      v-for="width in widths"
      :key="width.value"
      @click="$emit('selected', width.value)"
      class="content-width">
      <span :class="width.icon" class="mdi"></span>
      <span>{{ width.label }} width</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-width',
  data() {
    return {
      widths: [
        { label: 'Half', value: 6, icon: 'mdi-page-layout-sidebar-left' },
        { label: 'Full', value: 12, icon: 'mdi-page-layout-body' }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.select-width {
  display: inline-block;
}

.content-width {
  display: inline-block;
  margin: 0 20px;
  padding: 5px 10px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .mdi {
    font-size: 36px;
  }
}
</style>
