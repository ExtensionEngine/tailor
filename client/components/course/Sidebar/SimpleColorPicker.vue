<template>
  <div class="picker control">
    <span class="title">{{ meta.label }}</span>
    <ul class="colors control-group">
      <li
        v-for="group in colors"
        class="column">
        <ul>
          <li
            v-for="color in group"
            @click="select(color)"
            :style="{ background: color }"
            :class="{ white: equals(color, white) }"
            class="tile">
            <div v-if="equals(color, selected)" class="dot"></div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import get from 'lodash/get';

const defaultColors = [
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
  name: 'SimpleColorPicker',
  props: ['meta'],
  computed: {
    selected() {
      return this.value || get(this.colors, '[0][0]', '#000000');
    },
    white() {
      return '#FFFFFF';
    }
  },
  data() {
    return {
      colors: this.meta.colors || defaultColors,
      value: null
    };
  },
  methods: {
    select(color) {
      this.value = color;
      this.$emit('update', this.meta.key, color);
    },
    equals(color1 = '', color2 = '') {
      return color1.trim().toLowerCase() === color2.trim().toLowerCase();
    }
  }
};

</script>

<style lang="scss" scoped>
$size: 15px;
$gutter: 5px;

.control {
  padding: 3px 8px;
  &:hover { background-color: #f5f5f5; };
}

.title {
  display: block;
  color: #808080;
  margin-bottom: 10px;
}

.control-group {
  margin: 5px 0px 5px 0;
  line-height: 24px;
  word-wrap: break-word;
  font-weight: normal;
  color: #333;
}

ul {
  margin: 0;
  padding: 0;
}

.colors {
  overflow: auto
}

.column {
  float: left;
  list-style: none;
}

.tile {
  width: $size;
  height: $size;
  position: relative;
  list-style: none;
  cursor: pointer;
  margin: 0 $gutter $gutter 0;
  &:last-child { margin-bottom: 0; }

  &.white { box-shadow: inset 0 0 0 1px #ddd; }
}

.dot {
  position: absolute;
  width: $size/3;
  height: $size/3;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  border-radius: 50%;
  opacity: 1;
  background: #fff;
  .white & { background: #000; }
}

</style>
