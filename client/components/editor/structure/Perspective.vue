<template>
  <div class="perspective">
    <draggable class="row">
      <asset v-for="asset in assets" :asset="asset"></asset>
    </draggable>
    <create-asset></create-asset>
  </div>
</template>

<script>
import { mapGetters } from 'vuex-module';
import Draggable from 'vuedraggable';
import Asset from '../assets';
import CreateAsset from './CreateAsset';

export default {
  name: 'perspective',
  computed: mapGetters(['assets']),
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
