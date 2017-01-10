<template>
  <div class="select-width">
    <div
      class="content-width"
      v-for="width in widths"
      @click="$emit('selected', width.value)">
      <span class="fa" :class="width.icon"></span>
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

<style lang="scss">
.select-width {
  display: inline-block;
}

.content-width {
  display: inline-block;
  padding: 5px 10px;
  margin: 0 20px;

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
    font-size: 26px;
  }
}
</style>
