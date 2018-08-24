<template>
  <div class="">
    <form>
      <div class="settings row">
        <div :class="[col, {'has-error': vErrors.has('min')}]">
          <div class="form-group">
            <span class="form-label">Minimum</span>
            <input
              v-validate.disable="setValidation('min')"
              v-model.lazy.number="min"
              :disabled="!isEditing"
              :placeholder="options.min"
              @focusout="setValues($event.target.name)"
              data-vv-as="minimum"
              type="text"
              name="min"
              class="form-control">
          </div>
        </div>
        <div :class="[col, {'has-error': vErrors.has('max')}]">
          <div class="form-group">
            <span class="form-label">Maximum</span>
            <input
              v-validate.disable="setValidation('max')"
              v-model.lazy.number="max"
              :disabled="!isEditing"
              :placeholder="options.max"
              @focusout="setValues($event.target.name)"
              data-vv-as="maximum"
              type="text"
              name="max"
              class="form-control">
          </div>
        </div>
        <div :class="[col, {'has-error': vErrors.has('interval')}]">
          <div class="form-group">
            <span class="form-label">Step</span>
            <input
              v-validate.disable="setValidation('interval')"
              v-model.lazy.number="interval"
              :disabled="!isEditing"
              :placeholder="options.interval"
              @focusout="setValues($event.target.name)"
              data-vv-as="step"
              type="text"
              name="interval"
              class="form-control">
          </div>
        </div>
        <div v-if="isEditing" class="col-xs-3 reset-button">
          <i @click="reset()" title="Reset" class="mdi mdi-replay"></i>
        </div>
      </div>
    </form>
    <div class="slider-container">
      <vue-slider
        v-validate.disable="'different'"
        v-if="showSlider"
        v-model="value"
        v-bind="options"
        :disabled="!isEditing"
        :class="{ 'correct-error': (correctMin == correctMax) }"
        @drag-end="setValues('value')"
        data-vv-name="value"
        class="slider">
      </vue-slider>
      <div class="slider-edge-label slider-first"> {{ options.min }} </div>
      <div class="slider-edge-label slider-last"> {{ options.max }} </div>
    </div>
    <div :class="{ 'has-error': vErrors.any() }" class="feedback">
      <span
        v-for="(error, index) in vErrors.all()"
        :key="index"
        class="help-block">
        {{ error }}
      </span>
    </div>
  </div>
</template>

<script>
import { defaults } from 'utils/assessment';
import vueSlider from 'vue-slider-component';
import get from 'lodash/get';
import { withValidation } from 'utils/validation';
import round from 'lodash/round';

// Specify the allowed number of decimal places
const DEC = 3;
// JS native modulo returns wrong result for decimal divisors
const pow = Math.pow(10, DEC);
const modulo = (c, m) => ((pow * c) % (pow * m)) / pow;

export default {
  mixins: [withValidation()],
  props: {
    assessment: { type: Object, default: defaults.RS },
    isEditing: { type: Boolean, default: false }
  },
  data() {
    const range = get(this.assessment, 'range', {});
    const correct = get(this.assessment, 'correct', []);
    return {
      value: correct,
      options: {
        ...range
      },
      initialRange: range,
      initialCorrect: correct,
      ...range,
      DEC,
      showSlider: true
    };
  },
  computed: {
    correctMin() {
      return this.value[0];
    },
    correctMax() {
      return this.value[1];
    },
    col() {
      return `col-xs-${(this.isEditing) ? 3 : 4}`;
    }
  },
  methods: {
    setValues(field) {
      let value = this[field];
      if (value === '') value = this.options[field];
      this.$validator.validate(field)
      .then(valid => {
        if (valid) {
          switch (field) {
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
        }
      });
    },
    setMin(newMin) {
      if (newMin <= this.correctMin) return (this.options.min = newMin);
      this.value = (newMin > this.correctMax)
        ? [newMin, this.options.max]
        : [newMin, this.correctMax];
      this.options.min = newMin;
    },
    setMax(newMax) {
      if (newMax >= this.correctMax) return (this.options.max = newMax);
      this.value = (newMax < this.correctMin)
        ? [this.options.min, newMax]
        : [this.correctMin, newMax];
      this.options.max = newMax;
    },
    setInterval(value) {
      this.options.interval = value;
    },
    reset() {
      this.showSlider = false;
      this.$nextTick(() => {
        Object.assign(this.options, this.initialRange);
        Object.assign(this, this.initialRange);
        this.value = this.initialCorrect;
        this.showSlider = true;
        this.update();
      });
    },
    update() {
      const { min, max, interval } = this.options;
      const range = { min, max, interval };
      const correct = this.value;
      this.$emit('update', { range, correct });
    },
    setValidation(field) {
      const rules = { decimal: DEC, interval: field };
      const limitField = (field === 'min') ? 'max' : 'min';
      const limit = (limitField === 'min')
        ? round(this.options[limitField] + this.options.interval, DEC)
        : round(this.options[limitField] - this.options.interval, DEC);
      if (field !== 'interval') {
        Object.assign(rules, {[`${limitField}_value`]: limit});
      }
      return rules;
    }
  },
  created() {
    this.$validator.extend('interval', {
      getMessage(field) {
        const targetField = (field === 'step') ? 'range' : 'step';
        return `Invalid ${field} for specified ${targetField}.`;
      },
      validate: (value, field) => {
        let { min, max, interval } = {
          ...this.options, [field]: value
        };
        const valid = (min >= 0)
          ? interval <= max
          : interval <= Math.abs(min);
        return (!modulo(round(max - min, DEC), interval) &&
          interval > 0 && valid);
      }
    });
    this.$validator.extend('different', {
      getMessage: () => 'Correct interval values must differ.',
      validate: () => (this.correctMin !== this.correctMax)
    });
  },
  components: {
    vueSlider
  }
};
</script>

<style lang="scss" scoped>
.settings {
  margin-bottom: 10px;
  height: 75px;
}

.vue-slider-component {
  margin: 0 auto;
}

input.form-control[disabled] {
  padding-left: 8px;
}

.custom-label {
  margin-top: 15px;
}

.reset {
  margin-top: 15px;
}

.feedback {
  margin-top: 40px;
}

.slider-container {
  margin-top: 30px;
}

.slider-edge-label {
  display: inline;
}

.slider-first {
  float: left;
}

.slider-last {
  float: right;
}

.reset-button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 13px;
  i {
    transition: 0.5s;
    transition-delay: 0.1s;
  }
  i::before{
    cursor: pointer;
    font-size: 30px;
    color: #3498db;
  }
  i:hover {
    transition: 0.5s;
    transition-delay: 0.1s;
    transform: rotate(-360deg);
  }
}

.correct-error /deep/ .vue-slider-tooltip {
   background-color: #d43f3a;
   border-color: #d9534f;
}

.slider /deep/ .vue-slider-process {
  background: linear-gradient(left, #5cb85c, #3498db);
}
</style>
