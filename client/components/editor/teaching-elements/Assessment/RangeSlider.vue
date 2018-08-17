<template>
<div>
  <div id="settings">
    <div class="col-xs-4">
      <input
        @focusout="setValues('min', $event.target.value)"
        type="text"
        placeholder="Min..."
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        @focusout="setValues('max', $event.target.value)"
        type="text"
        placeholder="Max..."
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        @input="setValues('interval', $event.target.value)"
        type="text"
        placeholder="Interval..."
        class="form-control">
    </div>
  </div>
  <div id="slider">
    <input
      v-model="includeMin"
      @change="update()"
      title="Include Min"
      type="checkbox"
      class="include-flag">
    <vue-slider
      v-model="value"
      v-bind="options"
      @input="update()"
      ref="slider">
    </vue-slider>
    <input
      v-model="includeMax"
      @change="update()"
      title="Include Max"
      type="checkbox"
      class="include-flag">
  </div>
</div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';

export default {
  props: {
    assessment: Object
  },
  data() {
    return {
      value: [],
      options: {
        processStyle: {
          backgroundImage: '-webkit-linear-gradient(left, #5cb85c, #3498db)'
        },
        width: '90%',
        useKeyboard: true,
        min: null,
        max: null
      },
      includeMin: true,
      includeMax: true
    };
  },
  created() {
    this.value = [
      this.correct[0],
      this.correct[1]
    ];
    this.options.min = this.range.min;
    this.options.max = this.range.max;
    this.options.interval = this.range.interval;
  },
  computed: {
    correct() {
      return get(this.assessment, 'correct', []);
    },
    range() {
      return get(this.assessment, 'range', {});
    }
  },
  methods: {
    setValues(name, value) {
      if (!value) return;
      value = toNumber(value);
      if (isNaN(value)) return;
      switch (name) {
        case 'min':
          this.setMin(value);
          break;
        case 'max':
          this.setMax(value);
          break;
        case 'interval':
          this.options.interval = value;
          this.update();
          break;
      }
      // this.update();
    },
    setMin(value) {
      let slider = this.$refs.slider;
      if (value >= this.options.max) return;
      if (value > this.value[0]) {
        if (value > this.value[1]) {
          slider.setValue([value, this.options.max]);
        } else {
          slider.setValue([value, this.value[1]]);
        }
        this.options.min = value;
      } else {
        this.options.min = value;
        this.update();
      }
    },
    setMax(value) {
      let slider = this.$refs.slider;
      if (value <= this.options.min) return;
      if (value < this.value[1]) {
        if (value < this.value[0]) {
          slider.setValue([this.options.min, value]);
        } else {
          slider.setValue([this.value[0], value]);
        }
        this.options.max = value;
      } else {
        this.options.max = value;
        this.update();
      }
    },
    update() {
      let {min, max, interval} = this.options;
      let range = {min, max, interval};
      let correct = [
        (this.includeMin) ? this.value[0] : this.value[0] + 1,
        (this.includeMax) ? this.value[1] : this.value[1] - 1
      ];
      this.$emit('update', {range, correct});
      // console.log({range, correct});
    }
  },
  components: {
    vueSlider
  }
};
</script>

<style lang="scss" scoped>
#settings {
  height: 75px;
}
#slider {
  display: flex;
}
.vue-slider-component {
  margin: 0 auto;
}
.include-flag {
  transform: scale(0.9);
}
</style>
