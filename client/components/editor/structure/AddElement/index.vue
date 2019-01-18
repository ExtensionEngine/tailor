<template>
  <div class="add-element">
    <div @click="toggleSelection" class="btn-base">
      <span
        :class="[selectionOpened ? 'btn-close' : 'btn-open']"
        class="mdi mdi-plus toggle-selection">
      </span>
    </div>
    <transition name="slide-fade">
      <component v-if="selectionOpened" :is="selectContainer">
        <select-element
          v-if="!type"
          :activity="activity"
          :include="include"
          @selected="setType"/>
        <select-width v-if="canSelectWidth" @selected="setWidth"/>
      </component>
    </transition>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import get from 'lodash/get';
import cuid from 'cuid';
import InlineContainer from './InlineContainer';
import PopoverContainer from './PopoverContainer';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';

const DEFAULT_WIDTH = 12;
const FIXED_WIDTH_TYPES = ['ACCORDION', 'ASSESSMENT', 'BREAK', 'CAROUSEL', 'TABLE'];

const getEmbededData = (type, data) => ({ id: cuid(), type, data, embedded: true });

const elementData = {
  build(type, width, position, activityId, ...args) {
    let data = { width };
    if (this[type]) Object.assign(data, this[type](...args));
    const opts = activityId ? { position, activityId } : getEmbededData(type, data);
    return { type, data, ...opts };
  },
  ASSESSMENT: subtype => {
    const question = getEmbededData('HTML', { width: 12 });
    return { ...defaults[subtype](), question: [question] };
  },
  ACCORDION: () => {
    const id = cuid();
    const items = { [id]: { id, header: 'Header', body: {} } };
    return { items, embeds: {} };
  }
};

export default {
  name: 'add-element',
  props: {
    activity: { type: Object, default: null },
    position: { type: Number, default: null },
    layout: { type: Boolean, default: true },
    include: { type: Array, default: null },
    popover: { type: Boolean, default: false }
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
    canSelectWidth() {
      const { layout, type } = this;
      return layout && type && !FIXED_WIDTH_TYPES.includes(type);
    },
    selectContainer() {
      const type = this.popover ? 'popover' : 'inline';
      return `${type}-container`;
    }
  },
  methods: {
    toggleSelection() {
      if (this.selectionOpened) return this.close();
      this.selectionOpened = true;
      this.$emit('opened');
    },
    create() {
      const { type, subtype, width, activity, position } = this;
      const activityId = get(activity, 'id');
      const data = elementData.build(type, width, position, activityId, subtype);
      this.$emit('add', data);
      this.close(true);
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
    close(fully) {
      this.type = null;
      this.subtype = null;
      this.width = DEFAULT_WIDTH;
      this.selectionOpened = false;
      this.$emit('closed', fully);
    }
  },
  components: {
    InlineContainer,
    PopoverContainer,
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
    margin-right: 2px;
    transform: rotate(45deg);
    transition: all 0.2s ease-in-out;
  }

  .btn-base {
    color: #337ab7;
    font-size: 28px;
    line-height: 28px;
    vertical-align: top;
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
</style>
