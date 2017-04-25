<template>
  <div class="add-element">
    <div
      :class="{ 'btn-close': selectionOpened }"
      @click="toggleButton"
      class="btn-base">
      <span
        :class="[selectionOpened ? 'close-button' : 'open-button']"
        class="mdi mdi-plus toggle-button">
      </span>
    </div>
    <transition name="slide-fade">
      <div v-if="selectionOpened" class="selections">
        <select-element
          v-if="selectType"
          :include="include"
          @selected="setType">
        </select-element>
        <select-width v-if="selectWidth" @selected="setWidth"></select-width>
      </div>
    </transition>
  </div>
</template>

<script>
import cuid from 'cuid';
import { defaults } from 'utils/assessment';
import SelectElement from './SelectElement';
import SelectWidth from './SelectWidth';

export default {
  name: 'add-element',
  props: ['include', 'activity', 'position', 'layout'],
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
        (this.type !== 'CAROUSEL');
    }
  },
  methods: {
    toggleButton() {
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
        element.data = defaults[this.subtype];
        element.data.type = this.subtype;
        element.data.question = [
          { id: cuid(), type: 'HTML', data: { width: 12 }, embedded: true }
        ];
      }

      element.data.width = this.width || 12;

      if (element.type === 'ACCORDION') {
        const id = cuid();
        element.data = {
          embeds: {},
          items: {
            [id]: { id, header: 'Header', body: {} }
          }
        };
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
  margin: 20px 0 30px 0;
  color: #444;

  .toggle-button {
    display: inline-block;
  }

  .open-button {
    transition: all 0.2s ease-in-out;
  }

  .close-button {
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

  .btn-close {
    color: #333;
  }

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .2s ease-in-out;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(-30px);
    opacity: 0;
  }
}
</style>
