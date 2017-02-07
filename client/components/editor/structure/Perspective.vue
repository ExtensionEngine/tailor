<template>
  <div class="perspective">
    <draggable class="row" :list="perspectiveAssets" @update="reorder">
      <asset
        v-for="asset in perspectiveAssets"
        :asset="asset"
        :key="asset._cid">
      </asset>
    </draggable>
    <create-asset
      :perspective="perspective"
      :position="perspectiveAssets.length + 1">
    </create-asset>
  </div>
</template>

<script>
import { filter } from 'lodash';
import { mapActions, mapGetters } from 'vuex-module';
import Draggable from 'vuedraggable';
import Asset from '../assets';
import CreateAsset from './CreateAsset';

export default {
  name: 'perspective',
  props: ['perspective'],
  computed: {
    ...mapGetters(['assets']),
    perspectiveAssets() {
      return filter(this.assets, { activityId: this.perspective.id })
        .sort((a, b) => a.position - b.position);
    }
  },
  methods: {
    ...mapActions({ reorderAssets: 'reorder' }, 'assets'),
    reorder({ newIndex: index }) {
      const siblings = this.perspectiveAssets;
      const asset = siblings[index];
      const positionData = { index, siblings, sameLevel: true, reorder: true };

      this.reorderAssets({ asset, positionData, index });
    }
  },
  components: {
    Draggable,
    Asset,
    CreateAsset
  }
};
</script>

<style lang="scss">
.perspective {
  width: 100%;
  min-height: 200px;
  margin: 25px 0px;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);
}
</style>
