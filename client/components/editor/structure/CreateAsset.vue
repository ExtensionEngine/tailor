<template>
  <div class="create-asset">
    <transition name="slide-fade">
      <div v-if="selection">
        <select-width v-if="!width" @selected="setWidth"></select-width>
        <select-asset v-if="width && !type" @selected="setType"></select-asset>
        <div class="btn-base btn-close" @click="close">
          <span class="fa fa-close"></span>
        </div>
      </div>
    </transition>
    <div class="btn-base" v-if="!selection" @click="selection = !selection">
      <span class="fa fa-plus"></span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex-module';
import SelectAsset from './SelectAsset';
import SelectWidth from './SelectWidth';

export default {
  name: 'create-asset',
  props: ['perspective'],
  data() {
    return {
      selection: false,
      width: '',
      type: ''
    };
  },
  methods: {
    ...mapActions(['save'], 'assets'),
    ...mapMutations(['focusAsset'], 'atom'),
    create() {
      let asset = this.save({
        type: this.type,
        width: this.width,
        activityId: this.perspective.id
      });
      this.focusAsset(asset);
    },
    setWidth(width) {
      this.width = width;
    },
    setType(type) {
      this.type = type;
      this.create();
      this.close();
    },
    close() {
      this.selection = false;
      this.width = '';
      this.type = '';
    }
  },
  components: {
    SelectAsset,
    SelectWidth
  }
};
</script>

<style lang="scss">
.create-asset {
  margin: 20px 0;
  color: #444;

  .btn-base {
    font-size: 28px;
    line-height: 28px;
    vertical-align: top;

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .btn-close {
    display: inline-block;
    margin: 3px 0px 0px 20px;
    color: #333;
  }

  .slide-fade-enter-active {
    transition: all .5s ease;
  }

  .slide-fade-enter {
    transform: translateX(10px);
    opacity: 0;
  }

  .slide-fade-leave-active {
    display: none;
  }
}
</style>
