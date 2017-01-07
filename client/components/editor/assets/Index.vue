<template>
  <div class="asset-container" :class="columnWidth">
    <div class="asset">
      <text-editor v-if="asset.type === 'text'"></text-editor>
    </div>
  </div>
</template>

<script>
import TextEditor from './Text';

export default {
  name: 'asset',
  props: { asset: Object },
  computed: {
    columnWidth() {
      return `col-xs-${this.asset.width}`;
    }
  },
  components: {
    TextEditor
  }
};
</script>

<style lang="scss">
.asset-container {
  padding: 7px 0;
}

.asset {
  padding: 5px;
  border: 1px dashed #ccc;
}
</style>
