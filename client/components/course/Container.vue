<template>
  <div>
    {{ name }}
    <outline :activities="activities"></outline>
  </div>
</template>

<script>
import Outline from './Outline.vue';
import { mapState } from 'vuex';

export default {
  computed: mapState({
    activities: state => state.editor.activities
  }),
  components: {
    Outline
  }
};
</script>

<style lang="scss">

</style>
