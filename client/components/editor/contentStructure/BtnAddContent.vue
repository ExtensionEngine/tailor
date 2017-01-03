<template>
  <div class="btn-add-content">
    <div
      v-if="!selection"
      @click="selection = !selection"
      class="btn-base">
      <span class="fa fa-plus"></span>
    </div>
    <transition name="slide-fade">
      <div v-if="selection">
        <div
          v-for="it in contentTypes"
          @click="add(it.type)"
          class="content-type">
          <span class="fa" :class="it.icon"></span>
          <span>{{ it.label }}</span>
        </div>
        <div class="btn-base btn-close" @click="close">
          <span class="fa fa-close"></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations } from 'vuex-module';

export default {
  name: 'btn-add-content',
  data() {
    return {
      selection: false,
      contentTypes: [
        { type: 'video', label: 'Video', icon: 'fa-video-camera' },
        { type: 'text', label: 'Text', icon: 'fa-file-text-o' },
        { type: 'image', label: 'Image', icon: 'fa-image' }
      ]
    };
  },
  methods: {
    ...mapMutations({ addAsset: 'add' }, 'assets'),
    add(type) {
      this.selection = false;
      this.addAsset({ type });
    },
    close() {
      this.selection = false;
    }
  }
};
</script>

<style lang="scss">
.btn-add-content {
  margin-top: 20px;
  color: #444;

  .btn-base {
    font-size: 28px;
    line-height: 28px;
    vertical-align: top;
    cursor: pointer;

    &:hover {
      color: #42b983;
    }
  }

  .btn-close {
    display: inline-block;
    margin: 3px 0px 0px 20px;
    color: #333;
  }

  .content-type {
    display: inline-block;
    margin: 0 20px;
    padding: 5px 10px;

    .fa {
      padding-bottom: 7px;
      font-size: 26px;
    }

    span {
      font-size: 16px;
      display: block;
    }

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .slide-fade-enter-active {
    transition: all .7s ease;
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
