<template>
  <div>
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
