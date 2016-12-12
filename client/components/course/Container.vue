<template>
  <div>
    {{ name }}
    <outline :activities="activities"></outline>
  </div>
</template>

<script>
import Outline from './Outline.vue';
import { mapState } from 'vuex-module';

export default {
  data() {
    return {
      name: 'Javascript'
    };
  },
  computed: mapState(['activities']),
  components: {
    Outline
  }
};
</script>

<style lang="scss">

</style>
