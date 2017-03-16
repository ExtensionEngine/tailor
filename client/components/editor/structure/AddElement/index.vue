<template>
  <div class="add-element">
    <transition name="slide-fade">
      <div v-if="selection">
        <select-element
          v-if="selectType"
          :include="include"
          @selected="setType">
        </select-element>
        <select-width v-if="selectWidth" @selected="setWidth"></select-width>
        <div class="btn-base btn-close" @click="close">
          <span class="mdi mdi-close"></span>
        </div>
      </div>
    </transition>
    <div class="btn-base" v-if="!selection" @click="selection = !selection">
      <span class="mdi mdi-plus"></span>
    </div>
  </div>
</template>

<script>
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';

export default {
  name: 'add-element',
  props: ['include', 'activity', 'position'],
  data() {
    return {
      type: null,
      subtype: null,
      width: null,
      selection: false
    };
  },
  computed: {
    selectType(selection) {
      return !this.type;
    },
    selectWidth() {
      return !this.selectType && (this.type !== 'ASSESSMENT');
    }
  },
  methods: {
    create() {
      let element = { type: this.type, data: {} };
      if (this.activity) {
        element.activityId = this.activity.id;
        element.position = this.position;
      } else {
        element.embedded = true;
      }

      if (element.type === 'ASSESSMENT') {
        element.data = defaults[this.subtype];
        element.data.type = this.subtype;
        element.data.question = [
          { id: cuid(), type: 'HTML', data: { width: 12 }, embedded: true }
        ];
      }

      element.data.width = this.width || 12;
      this.$emit('add', element);
      this.close();
    },
    setType({ type, subtype }) {
      this.type = type;
      this.subtype = subtype;
      if (!this.selectWidth) this.create();
    },
    setWidth(width) {
      this.width = width;
      this.create();
    },
    close() {
      this.type = null;
      this.subtype = null;
      this.width = null;
      this.selection = false;
    }
  },
  components: {
    SelectElement,
    SelectWidth
  }
};
</script>

<style lang="scss" scoped>
.add-element {
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
    margin: 10px 0px 0px 20px;
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
