<template>
  <div>
    {{ name }}
    <outline :activities="activities"></outline>
  </div>
</template>

<script>
import Outline from './Outline';
import { mapState } from 'vuex-module';

export default {
  name: 'course-details',

  components: {
    Outline
  },

  data() {
    return {
      name: 'Javascript'
    };
  },

  computed: mapState(['activities'])
};
</script>

<style lang="scss">

</style>
