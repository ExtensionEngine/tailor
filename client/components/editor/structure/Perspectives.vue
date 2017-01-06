<template>
  <div class="perspectives">
    <perspective v-for="it in perspectives"></perspective>
    <create-perspective @create="add"></create-perspective>
  </div>
</template>

<script>
import cuid from 'cuid';
import Perspective from './Perspective';
import CreatePerspective from './CreatePerspective';

export default {
  name: 'perspectives',
  data() {
    return {
      perspectives: []
    };
  },
  methods: {
    add() {
      this.perspectives.push({ _cid: cuid() });
    }
  },
  components: {
    CreatePerspective,
    Perspective
  }
};
</script>

<style lang="scss">
</style>
