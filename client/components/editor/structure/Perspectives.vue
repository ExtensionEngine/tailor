<template>
  <div class="perspectives">
    <div class="well" v-if="!perspectives.length">
      Click the button bellow to Create first Perspective.
    </div>
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
.perspectives {
  h2 {
    margin-bottom: 20px;
    font-size: 18px;
    color: #444;
  }

  .well {
    font-size: 16px;
  }
}
</style>
