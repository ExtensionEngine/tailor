<template>
  <div class="editor" @click="clicked">
    <toolbar></toolbar>
    <div class="container">
      <h2>{{ activity.name }}</h2>
      <perspectives></perspectives>
      <assessments></assessments>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex-module';
import Assessments from './structure/Assessments';
import Perspectives from './structure/Perspectives';
import Toolbar from './toolbar';

export default {
  name: 'editor',
  computed: {
    ...mapGetters(['activity'], 'editor'),
    ...mapGetters(['focusedAsset'], 'atom')
  },
  methods: {
    clicked(e) {
      if (!this.focusedAsset) return;
      if (!e.component ||
        ((e.component.name !== 'toolbar') &&
        (e.component.data._cid !== this.focusedAsset._cid))) {
        this.focusoutAsset();
      }
    },
    ...mapActions(['focusoutAsset'], 'atom')
  },
  components: {
    Toolbar,
    Perspectives,
    Assessments
  }
};
</script>

<style lang="scss">
.editor {
  h2 {
    margin: 80px 0 30px 0;
    font-size: 20px;
    color: #444;
    text-align: left;
  }
}
</style>
