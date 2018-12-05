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
import { defaults } from 'utils/assessment';
import cloneDeep from 'lodash/cloneDeep';
import cuid from 'cuid';
import isFunction from 'lodash/isFunction';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';
import times from 'lodash/times';

const getTextElement = () =>
  ({ id: cuid(), type: 'HTML', embedded: true, data: { width: 12 } });

export default {
  name: 'add-element',
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
    }
  },
  methods: {
    toggleSelection() {
      if (this.selectionOpened) {
        this.close();
      } else {
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
        element.data.question = [getTextElement()];
      }

      if (element.type === 'POLL') {
        const question = getTextElement();
        element.data = {
          name: null,
          embeds: { [question.id]: question },
          question: question.id,
          options: []
        };
        times(2, i => {
          const option = { ...getTextElement(), position: i + 1 };
          element.data.embeds[option.id] = option;
          element.data.options.push(option.id);
        });
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
