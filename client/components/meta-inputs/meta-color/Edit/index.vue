<template>
  <div class="picker control my-2">
    <span class="picker-title">{{ meta.label }}</span>
    <color-input @input="select" :value="selected" />
    <ul class="colors control-group pl-0">
      <li
        v-for="(group, index) in colors"
        :key="index"
        class="column">
        <ul class="pl-0">
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
</template>

<script>
import ColorInput from './ColorInput.vue';
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
$size: 1.125rem;
$gutter: 0.375rem;

.control-group {
  margin: 0.375rem 0;
  line-height: 1.5rem;
  font-weight: normal;
  color: #333;
  word-wrap: break-word;
}

.picker {
  padding: 0.75rem 0.625rem;

  &-title {
    display: block;
    margin-bottom: 0.625rem;
    font-size: 0.875rem;
    line-height: 1rem;
    font-weight: normal;
    text-align: left;
    color: rgb(0 0 0 / 60%);
  }
}

ul {
  margin: 0;
  padding: 0;
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
  margin: 0 $gutter $gutter 0;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 10%);
  border-radius: 2px;
  width: $size;
  height: $size;
  cursor: pointer;
  list-style: none;

  &:last-child {
    margin-bottom: 0;
  }
}

.dot {
  position: absolute;
  inset: 0;
  opacity: 1;
  margin: auto;
  border-radius: 50%;
  width: calc($size / 3);
  height: calc($size / 3);
  background: #fff;

  .white & {
    background: #000;
  }
}
</style>
