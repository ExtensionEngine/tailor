<template>
  <div class="editor" @click="clicked">
    <toolbar></toolbar>
    <div class="container">
      <h2>{{ activity.name }}</h2>
      <perspectives></perspectives>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Toolbar from './toolbar';
import Perspectives from './structure/Perspectives';

export default {
  name: 'editor',
  computed: mapGetters(['activity'], 'editor'),
  methods: {
    clicked(e) {
      // TODO: Implement asset toolbar focusout handling
    }
  },
  components: {
    Toolbar,
    Perspectives
  }
};
</script>

<style lang="scss">
.editor {
  h2 {
    margin-top: 80px;
    text-align: left;
  }
}
</style>
