<template>
<div id="main">
  <div id="settings">
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('min', $event.target.value)"
        type="text"
        name="min"
        placeholder="Min..."
        title="Minimum"
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('max', $event.target.value)"
        type="text"
        name="max"
        placeholder="Max..."
        title="Maximum"
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('interval', $event.target.value)"
        type="text"
        name="interval"
        placeholder="Interval..."
        title="Interval"
        class="form-control">
    </div>
  </div>
  <div id="slider">
    <input
      :disabled="!isEditing"
      v-model="includeMin"
      @change="update()"
      title="Include Min"
      type="checkbox"
      class="include-flag">
    <vue-slider
      :disabled="!isEditing"
      v-model="value"
      v-bind="options"
      @input="update()"
      ref="slider">
      <div slot="label" slot-scope="{ label }" class="custom-label">
        <span v-if="(label === options.min || label === options.max)">
          {{ label }}
        </span>
      </div>
    </vue-slider>
    <input
      :disabled="!isEditing"
      v-model="includeMax"
      @change="update()"
      title="Include Max"
      type="checkbox"
      class="include-flag">
  </div>
  <div :class="{ 'has-error': feedback.length > 0 }">
    <span v-for="msg in feedback" :key="msg" class="help-block">
      {{ msg }}
    </span>
  </div>
</div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';

// JS native modulo returns wrong result for decimal divisors
const modulo = (c, m) => ((100 * c) % (100 * m)) / 100;
const focus = (name) => document.getElementsByName(name)[0].focus();

export default {
  props: {
    assessment: Object,
    isEditing: Boolean
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
        max: null,
        piecewiseLabel: true
      },
      includeMin: true,
      includeMax: true,
      feedback: []
    };
  },
  created() {
    this.value = [this.correct[0], this.correct[1]];
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
      this.feedback = [];
      if (!value) return;
      value = toNumber(value);
      if (isNaN(value)) {
        this.feedback.push('Invalid input.');
        return focus(name);
      }
      switch (name) {
        case 'min':
          this.setMin(value);
          break;
        case 'max':
          this.setMax(value);
          break;
        case 'interval':
          this.setInterval(value);
          break;
      }
      this.update();
    },
    setMin(value) {
      let slider = this.$refs.slider;
      if (modulo(value - this.options.min, this.options.interval)) {
        this.feedback.push('Invalid minimum for specified interval.');
        return focus('min');
      }
      if (value >= this.options.max) {
        this.feedback.push('Minimum value cannot be equal to or greater than the maximum value.');
        return focus('min');
      }
      if (value > this.value[0]) {
        if (value > this.value[1]) {
          slider.setValue([value, this.options.max]);
        } else {
          slider.setValue([value, this.value[1]]);
        }
        this.options.min = value;
      } else {
        this.options.min = value;
      }
    },
    setMax(value) {
      let slider = this.$refs.slider;
      if (modulo(value - this.options.min, this.options.interval)) {
        this.feedback.push('Invalid maximum for specified interval.');
        return focus('max');
      }
      if (value <= this.options.min) {
        this.feedback.push('Maximum value cannot be equal to or less than the minimum value.');
        return focus('max');
      }
      if (value < this.value[1]) {
        if (value < this.value[0]) {
          slider.setValue([this.options.min, value]);
        } else {
          slider.setValue([this.value[0], value]);
        }
        this.options.max = value;
      } else {
        this.options.max = value;
      }
    },
    setInterval(value) {
      if (modulo(this.options.max - this.options.min, value) !== 0) {
        this.feedback.push('Invalid interval for specified range.');
        return focus('interval');
      }
      this.options.interval = value;
    },
    update() {
      let {min, max, interval} = this.options;
      let range = {min, max, interval};
      let correct = [
        (this.includeMin) ? this.value[0] : (this.value[0] + 1),
        (this.includeMax) ? this.value[1] : (this.value[1] - 1)
      ];
      this.$emit('update', {range, correct});
    }
  },
  components: {
    vueSlider
  }
};
</script>

<style lang="scss" scoped>
#main {
  margin-bottom: 10px;
}
#settings {
  margin-bottom: 10px;
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
.custom-label {
  margin-top: 15px;
}
.has-error {
  margin-top: 30px;
  padding: 0 15px;
}
</style>
