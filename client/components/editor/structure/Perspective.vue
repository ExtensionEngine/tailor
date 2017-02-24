<template>
  <div class="perspective">
    <div class="actions">
      <span @click="showModal" class="pull-right">
        <span class="fa fa-trash"></span>
      </span>
    </div>
    <div v-if="!perspectiveAssets.length" class="well">
      Click the button bellow to Create your first asset.
    </div>
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
import modalBus from '../../common/deletionModal/eventBus';

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
    ...mapActions({ updatePosition: 'reorder' }, 'assets'),
    reorder({ newIndex: newPosition }) {
      const items = this.perspectiveAssets;
      const asset = items[newPosition];
      const isFirstChild = newPosition === 0;
      const context = { items, newPosition, isFirstChild };
      this.updatePosition({ asset, context });
    },
    showModal() {
      modalBus.$emit('show', { item: this.perspective, type: 'perspective' });
    }
  },
  components: {
    Draggable,
    Asset,
    CreateAsset
  }
};
</script>

<style lang="scss" scoped>
.perspective {
  width: 100%;
  min-height: 245px;
  margin: 25px 0px;
  padding: 20px 40px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.30);
}

.actions {
  width: 100%;
  min-height: 36px;
  font-size: 20px;
  color: #707070;

  > span {
    padding: 0 10px;
  }

  > span:hover {
    cursor: pointer;
    color: #444;
  }
}
</style>
