<template>
  <div class="select-question-asset">
    <transition name="slide-fade">
      <div v-if="selection">
        <select-asset @selected="selected"></select-asset>
        <div @click="close" class="btn-base btn-close">
          <span class="fa fa-close"></span>
        </div>
      </div>
    </transition>
    <div v-if="!selection" @click="selection = !selection" class="btn-base">
      <span class="fa fa-plus"></span>
    </div>
  </div>
</template>

<script>
import SelectAsset from '../structure/SelectAsset';

export default {
  data() {
    return {
      selection: false,
      type: ''
    };
  },
  methods: {
    selected(type) {
      this.$emit('selected', type);
      this.close();
    },
    close() {
      this.selection = false;
    }
  },
  components: {
    SelectAsset
  }
};
</script>

<style lang="scss" scoped>
.select-question-asset {
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
