<template>
  <div class="add-element">
    <div @click="toggleSelection"
        :class="[locked ? 'locked' : 'unlocked']"
        class="btn-base"
        v-tooltip="tooltipConfig"
    >
      <span
        :class="[selectionOpened ? 'btn-close' : 'btn-open']"
        class="mdi mdi-plus toggle-selection">
      </span>
    </div>
    <transition name="slide-fade">
      <div v-if="selectionOpened" class="selections">
        <select-element
          v-if="selectType"
          :activity="activity"
          :include="include"
          @selected="setType">
        </select-element>
        <select-width v-if="selectWidth" @selected="setWidth"></select-width>
      </div>
    </transition>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import isFunction from 'lodash/isFunction';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';

export default {
  name: 'add-element',
  props: {
    include: { type: Array, default() { return []; } },
    activity: { type: Object, required: true },
    position: { type: Number, default: 1 },
    layout: { type: Boolean, default: false },
    locked: { type: Boolean, default: false },
    elementsLimit: { type: Number, default: Infinity }
  },
  data() {
    return {
      type: null,
      subtype: null,
      width: null,
      selectionOpened: false
    };
  },
  computed: {
    selectType() {
      return !this.type;
    },
    selectWidth() {
      return this.layout &&
        !this.selectType &&
        (this.type !== 'ACCORDION') &&
        (this.type !== 'ASSESSMENT') &&
        (this.type !== 'BREAK') &&
        (this.type !== 'CAROUSEL') &&
        (this.type !== 'TABLE');
    },
    tooltipConfig() {
      return {
        content:
          `${this.activity.type} has reached it's elements 
          limit of ${this.elementsLimit}`,
        class: 'warning-tooltip' + (!this.locked ? ' hidden' : '')
      };
    }
  },
  methods: {
    toggleSelection() {
      if (this.selectionOpened) {
        this.close();
      } else if (!this.locked) {
        this.selectionOpened = true;
      }
    },
    create() {
      let element = { type: this.type, data: {} };
      if (this.activity) {
        element.activityId = this.activity.id;
        element.position = this.position;
      } else {
        element.id = cuid();
        element.embedded = true;
      }

      if (element.type === 'ASSESSMENT') {
        element.data = isFunction(defaults[this.subtype])
          ? defaults[this.subtype]()
          : cloneDeep(defaults[this.subtype]);
        element.data.question = [
          { id: cuid(), type: 'HTML', data: { width: 12 }, embedded: true }
        ];
      }

      element.data.width = this.width || 12;

      if (element.type === 'ACCORDION') {
        const id = cuid();
        Object.assign(element.data, {
          embeds: {},
          items: {
            [id]: { id, header: 'Header', body: {} }
          }
        });
      }

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
      this.selectionOpened = false;
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
  margin: 20px 0 30px;
  color: #444;

  .toggle-selection {
    display: inline-block;
  }

  .btn-open {
    transition: all 0.2s ease-in-out;
  }

  .btn-close {
    transform: rotate(45deg);
    transition: all 0.2s ease-in-out;
  }

  .selections {
    margin-top: 10px;
    min-height: 85px;
  }

  .btn-base {
    font-size: 28px;
    line-height: 28px;
    vertical-align: top;
  }

  .btn-base.unlocked {
    &:hover {
      color: #42b983;
      cursor: pointer;
    }
  }

  .btn-base.locked {
    color: #cccccc;
  }

  .slide-fade-enter-active {
    transition: all 0.2s ease-in-out;
  }

  .slide-fade-enter {
    transform: translateY(-30px);
    opacity: 0;
  }

  .slide-fade-leave-to, .slide-fade-leave-active {
    display: none;
  }
}
</style>

<style>
  .vue-tooltip.warning-tooltip {
    color: #737373;
    background-color: white;
    font-family: 'Catamaran';
    overflow: hidden;
    white-space: nowrap;
    -webkit-box-shadow: none;
	  -moz-box-shadow: none;
    box-shadow: none;
  }

  .vue-tooltip.warning-tooltip.hidden {
    visibility: hidden;
  }
</style>
