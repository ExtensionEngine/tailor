<template>
  <div class="asset-container" :class="columnWidth">
    <div class="asset" @click="focus">
      <text-editor
        v-if="asset.type === 'text'"
        :asset="asset">
      </text-editor>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex-module';
import TextEditor from './Text';

export default {
  name: 'asset',
  props: { asset: Object },
  computed: {
    columnWidth() {
      return `col-xs-${this.asset.width}`;
    }
  },
  methods: {
    ...mapMutations(['focusAsset'], 'atom'),
    focus(e) {
      this.focusAsset(this.asset);
      // Attach component meta to event
      e.component = {
        name: 'asset',
        data: this.asset
      };
    }
  },
  components: {
    TextEditor
  }
};
</script>

<style lang="scss" scoped>
.asset-container {
  padding: 7px 0;
}

.asset {
  padding: 5px;
  border: 1px dashed #ccc;
}
</style>
