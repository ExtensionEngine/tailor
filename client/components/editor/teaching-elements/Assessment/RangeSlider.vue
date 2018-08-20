<template>
<div class="main">
  <div class="settings">
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('min', $event.target)"
        type="text"
        name="min"
        placeholder="Min..."
        title="Minimum"
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('max', $event.target)"
        type="text"
        name="max"
        placeholder="Max..."
        title="Maximum"
        class="form-control">
    </div>
    <div class="col-xs-4">
      <input
        :disabled="!isEditing"
        @focusout="setValues('interval', $event.target)"
        type="text"
        name="interval"
        placeholder="Interval..."
        title="Interval"
        class="form-control">
    </div>
  </div>
  <div class="slider-container">
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
      ref="slider"
      class="slider">
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

const sliderConfig = {
  width: '90%',
  useKeyboard: true,
  piecewiseLabel: true
};

export default {
  props: {
    assessment: Object,
    isEditing: Boolean
  },
  data() {
    const range = get(this.assessment, 'range', {});
    const correct = get(this.assessment, 'correct', []);
    return {
      value: [correct[0], correct[1]],
      options: {
        ...sliderConfig,
        min: range.min,
        max: range.max,
        interval: range.interval
      },
      includeMin: true,
      includeMax: true,
      feedback: []
    };
  },
  computed: {
    correctMin() {
      return this.value[0];
    },
    correctMax() {
      return this.value[1];
    }
  },
  methods: {
    setValues(name, el) {
      this.feedback = [];
      let value = el.value;
      if (!value) return;
      value = toNumber(value);
      if (isNaN(value)) {
        this.feedback.push('Invalid input.');
        return el.focus();
      }
      switch (name) {
        case 'min':
          this.setMin(value, el);
          break;
        case 'max':
          this.setMax(value, el);
          break;
        case 'interval':
          this.setInterval(value, el);
          break;
      }
      this.update();
    },
    setMin(value, el) {
      // TODO: move interval check into separate function
      if (modulo(this.options.max - value, this.options.interval)) {
        this.feedback.push('Invalid minimum for specified interval.');
        return el.focus();
      }
      if (value >= this.options.max) {
        this.feedback.push('Minimum value cannot be equal to or greater than the maximum value.');
        return el.focus();
      }
      if (value <= this.correctMin) {
        this.options.min = value;
        return;
      }
      if (value > this.correctMax) {
        this.value = [value, this.options.max];
      } else {
        this.value = [value, this.correctMax];
      }
      this.options.min = value;
    },
    setMax(value, el) {
      // interval check
      if (modulo(value - this.options.min, this.options.interval)) {
        this.feedback.push('Invalid maximum for specified interval.');
        return el.focus();
      }
      if (value <= this.options.min) {
        this.feedback.push('Maximum value cannot be equal to or less than the minimum value.');
        return el.focus();
      }
      if (value >= this.correctMax) {
        this.options.max = value;
        return;
      }
      if (value < this.correctMin) {
        this.value = [this.options.min, value];
      } else {
        this.value = [this.correctMin, value];
      }
      this.options.max = value;
    },
    setInterval(value, el) {
      // interval check
      if (modulo(this.options.max - this.options.min, value) !== 0) {
        this.feedback.push('Invalid interval for specified range.');
        return el.focus();
      }
      this.options.interval = value;
    },
    update() {
      const {min, max, interval} = this.options;
      const range = {min, max, interval};
      const correct = [
        (this.includeMin) ? this.correctMin : (this.correctMin + 1),
        (this.includeMax) ? this.correctMax : (this.correctMax - 1)
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
.main {
  margin-bottom: 10px;
}

.settings {
  margin-bottom: 10px;
  height: 75px;
}

.slider-container {
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

.slider /deep/ .vue-slider-process {
  background: linear-gradient(left, #5cb85c, #3498db);
}
</style>
