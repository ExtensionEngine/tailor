<template>
  <div class="editor" @click="clicked">
    <toolbar></toolbar>
    <div class="container">
      <h2>{{ activity.name }}</h2>
      <content-container></content-container>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Toolbar from './toolbar';
import ContentContainer from './structure/ContentContainer';

export default {
  name: 'editor',
  computed: mapGetters(['activity'], 'editor'),
  methods: {
    clicked(e) {
      // TODO: Implement asset editor focusout handling
    }
  },
  components: {
    Toolbar,
    ContentContainer
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
