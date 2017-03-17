<template>
  <div class="select-width">
    <div
      class="content-width"
      v-for="width in widths"
      @click="$emit('selected', width.value)">
      <span :class="width.icon" class="fa"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'select-width',
  data() {
    return {
      widths: [
        { value: 6, icon: 'fa-pause' },
        { value: 12, icon: 'fa-stop' }
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
  padding: 15px 10px;

  &:hover {
    color: #42b983;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
  }

  .fa {
    padding-bottom: 7px;
    font-size: 24px;
  }
}
</style>
