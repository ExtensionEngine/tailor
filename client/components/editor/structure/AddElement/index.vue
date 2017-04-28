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

      if (element.type === 'TABLE') {
        let embeds = {};
        let rows = {};
        // Create a default 3x2 table
        for (let i = 1; i <= 2; i++) {
          const rowId = cuid();
          rows[rowId] = { id: rowId, position: i, cells: {} };
          for (let j = 1; j <= 3; j++) {
            const embedId = cuid();
            const cellId = cuid();

            embeds[embedId] = {
              id: embedId,
              type: 'HTML-TABLE',
              embedded: true,
              data: { rowId, cellId, width: 12 }
            };
            rows[rowId].cells[cellId] = {
              id: cellId,
              position: j,
              body: { [embedId]: true }
            };
          }
        }
        element.data = {
          embeds,
          rows
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
    transition: all .2s ease-in-out;
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
