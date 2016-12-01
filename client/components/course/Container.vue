<template>
  <div>
    {{ name }}
    <outline></outline>
  </div>
</template>

<script>
import Outline from './Outline.vue';

export default {
  data: function () {
    return {
      name: 'Computer Science'
    };
  },
  components: {
    Outline
  }
};
</script>

<style lang="scss">

</style>
