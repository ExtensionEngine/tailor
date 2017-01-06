<template>
  <div class="perspectives">
    <div v-if="!perspectives.length">
      Click here to create new perspective.
    </div>
    <perspective v-for="it in perspectives"></perspective>
  </div>
</template>

<script>
import Perspective from './Perspective';

export default {
  name: 'perspectives',
  data() {
    return {
      perspectives: []
    };
  },
  components: {
    Perspective
  }
};
</script>

<style lang="scss">
</style>
