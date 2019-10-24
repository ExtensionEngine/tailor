<template>
  <div class="picker control">
    <span class="title">{{ meta.label }}</span>
    <color-input
      v-if="showInput"
      ref="picker"
      @close="showInput = false"
      @input="color => select(color)"
      :value="selected"
      class="picker" />
    <div v-else>
      <div class="preview">
        <div
          @click="showPicker"
          :style="{ background: selected }"
          class="selected">
          <span class="mdi mdi-eyedropper eyedropper"></span>
        </div>
      </div>
      <ul class="colors control-group">
        <li
          v-for="(group, index) in colors"
          :key="index"
          class="column">
          <ul>
            <li
              v-for="color in group"
              :key="color"
              @click="select(color)"
              :style="{ background: color }"
              :class="{ white: isEqualColor(color, '#FFFFFF') }"
              class="tile">
              <div v-if="isEqualColor(color, selected)" class="dot"></div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ColorInput from './ColorInput';
import get from 'lodash/get';

const DEFAULT_COLORS = [
  ['#4D4D4D', '#333333', '#000000'],
  ['#999999', '#808080', '#666666'],
  ['#FFFFFF', '#CCCCCC', '#B3B3B3'],
  ['#F44E3B', '#D33115', '#9F0500'],
  ['#FE9200', '#E27300', '#C45100'],
  ['#FCDC00', '#FCC400', '#FB9E00'],
  ['#DBDF00', '#B0BC00', '#808900'],
  ['#A4DD00', '#68BC00', '#194D33'],
  ['#68CCCA', '#16A5A5', '#0C797D'],
  ['#73D8FF', '#009CE0', '#0062B1'],
  ['#AEA1FF', '#7B64FF', '#653294'],
  ['#FDA1FF', '#FA28FF', '#AB149E']
];

export default {
  name: 'color-picker',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return {
      showInput: false,
      colors: this.meta.colors || DEFAULT_COLORS,
      value: this.meta.value
    };
  },
  computed: {
    selected() {
      return this.value || get(this.colors, '[0][0]', '#000000');
    }
  },
  methods: {
    showPicker() {
      this.showInput = true;
      setTimeout(() => this.$refs.picker.$el.scrollIntoView(), 0);
    },
    select(color) {
      if (this.value === color) return;
      this.value = color;
      this.$emit('update', this.meta.key, color);
    },
    isEqualColor(color1 = '', color2 = '') {
      return color1.trim().toLowerCase() === color2.trim().toLowerCase();
    }
  },
  components: { ColorInput }
};
</script>

<style lang="scss" scoped>
$size: 18px;
$gutter: 5px;

.control {
  padding: 3px 8px;

  &:hover {
    background-color: #f5f5f5;
  }
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}

.control-group {
  margin: 5px 0;
  color: #333;
  font-weight: normal;
  line-height: 24px;
  word-wrap: break-word;
}

.picker {
  padding-bottom: 10px;
}

ul {
  margin: 0;
  padding: 0;
}

.preview {
  float: left;
  margin-right: 10px;
}

.selected {
  width: 40px;
  height: 40px;
  text-align: center;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);

  .eyedropper {
    color: #fff;
    font-size: 18px;
    line-height: 40px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover .eyedropper {
    opacity: 1;
  }
}

.colors {
  overflow: auto;
}

.column {
  float: left;
  list-style: none;
}

.tile {
  position: relative;
  width: $size;
  height: $size;
  margin: 0 $gutter $gutter 0;
  list-style: none;
  cursor: pointer;
  border-radius: 2px;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.15);

  &:last-child {
    margin-bottom: 0;
  }
}

.dot {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: $size/3;
  height: $size/3;
  margin: auto;
  border-radius: 50%;
  opacity: 1;
  background: #fff;

  .white & {
    background: #000;
  }
}
</style>
