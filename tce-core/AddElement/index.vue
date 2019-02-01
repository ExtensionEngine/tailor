<template>
  <div class="add-element">
    <div @click="toggleSelection" class="btn-base">
      <span
        :class="[selectionOpened ? 'btn-close' : 'btn-open']"
        class="mdi mdi-plus toggle-selection">
      </span>
    </div>
    <transition name="slide-fade">
      <div v-if="selectionOpened" class="selections">
        <select-element
          v-if="!type"
          :activity="activity"
          :include="include"
          @selected="setType"/>
        <select-width v-if="canSelectWidth" @selected="setWidth"/>
      </div>
    </transition>
  </div>
</template>

<script>
import cuid from 'cuid';
import get from 'lodash/get';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';

const DEFAULT_WIDTH = 12;

export default {
  name: 'add-element',
  inject: ['$teRegistry'],
  props: {
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null }
  },
  data() {
    return {
      type: null,
      subtype: null,
      width: DEFAULT_WIDTH,
      selectionOpened: false
    };
  },
  computed: {
    config() {
      const { type, subtype, $teRegistry } = this;
      if (!type && !subtype) return;
      return $teRegistry.get(subtype || type);
    },
    forceWidth() {
      return get(this.config, 'ui.forceFullWidth', false);
    },
    canSelectWidth() {
      const { layout, type, forceWidth } = this;
      return layout && type && !forceWidth;
    }
  },
  methods: {
    toggleSelection() {
      if (this.selectionOpened) return this.close();
      this.selectionOpened = true;
    },
    create() {
      const { type, subtype, width, config } = this;
      const element = { type, width, data: {} };
      // If teaching element within activity
      if (this.activity) {
        element.activityId = this.activity.id;
        element.position = this.position;
      } else {
        // If embed, assign id
        element.id = cuid();
        element.embedded = true;
      }
      if (element.type === 'ASSESSMENT') {
        const data = { width: DEFAULT_WIDTH };
        const question = [{ data, id: cuid(), type: 'HTML', embedded: true }];
        element.data = { ...element.data, question, type: subtype };
      }
      const initState = get(config, 'initState', () => ({}));
      element.data = { ...element.data, ...initState() };
      this.$emit('add', element);
      this.close();
    },
    setType({ type, subtype }) {
      this.type = type;
      this.subtype = subtype;
      if (!this.canSelectWidth) this.create();
    },
    setWidth(width) {
      this.width = width;
      this.create();
    },
    close() {
      this.type = null;
      this.subtype = null;
      this.width = DEFAULT_WIDTH;
      this.selectionOpened = false;
    }
  },
  components: { SelectElement, SelectWidth }
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

    &:hover {
      color: #42b983;
      cursor: pointer;
    }
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
