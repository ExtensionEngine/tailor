<template>
<div class="">
  <form>
  <div class="settings row">
    <div :class="[col, {'has-error': vErrors.has('min')}]">
      <div class="form-group">
        <span class="form-label">Minimum</span>
        <input
          v-model.lazy.number="min"
          v-validate.disable="setValidation('min')"
          :disabled="!isEditing"
          :placeholder="options.min"
          @focusout="setValues($event.target.name)"
          type="text"
          name="min"
          class="form-control">
      </div>
    </div>
    <div :class="[col, {'has-error': vErrors.has('max')}]">
      <div class="form-group">
        <span class="form-label">Maximum</span>
        <input
          v-model.lazy.number="max"
          v-validate.disable="setValidation('max')"
          :disabled="!isEditing"
          :placeholder="options.max"
          @focusout="setValues($event.target.name)"
          type="text"
          name="max"
          class="form-control">
      </div>
    </div>
    <div :class="[col, {'has-error': vErrors.has('interval')}]">
     <div class="form-group">
      <span class="form-label">Step</span>
      <input
        v-model.lazy.number="interval"
        v-validate.disable="setValidation('interval')"
        :disabled="!isEditing"
        :placeholder="options.interval"
        @focusout="setValues($event.target.name)"
        type="text"
        name="interval"
        class="form-control">
      </div>
    </div>
    <div v-if="isEditing" class="col-xs-3">
      <button
        @click="reset()"
        type="button"
        class="btn btn-danger reset">
        Reset
      </button>
    </div>
  </div>
  </form>
  <div class="slider-container">
    <vue-slider
      v-if="showSlider"
      v-model="value"
      v-bind="options"
      v-validate.disable="'different'"
      data-vv-name="value"
      :disabled="!isEditing"
      :class="{ 'correct-error': (correctMin == correctMax) }"
      @drag-end="setValues('value')"
      class="slider">
    </vue-slider>
    <div class="slider-edge-label slider-first"> {{ options.min }} </div>
    <div class="slider-edge-label slider-last"> {{ options.max }} </div>
  </div>
  <div :class="{ 'has-error': vErrors.any() }" class="feedback">
    <span v-for="(error, index) in vErrors.all()" :key="index" class="help-block">
      {{ error }}
    </span>
  </div>
</div>
</template>

<script>
import vueSlider from 'vue-slider-component';
import get from 'lodash/get';
import { withValidation } from 'utils/validation';

// Specify the allowed number of decimal places
const DEC = 3;
// JS native modulo returns wrong result for decimal divisors
const modulo = (c, m) => ((10 ** DEC * c) % (10 ** DEC * m)) / 10 ** DEC;

export default {
  mixins: [withValidation()],
  props: {
    assessment: Object,
    isEditing: Boolean
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
  created() {
    this.$validator.extend('interval', {
      getMessage(field) {
        const targetField = (field === 'interval') ? 'range' : 'interval';
        return `Invalid ${field} for specified ${targetField}.`;
      },
      validate: (value, args) => {
        let { min, max, interval } = {
          ...this.options, [args]: value
        };
        return !modulo(+parseFloat(max - min).toFixed(DEC), interval);
      }
    });
    this.$validator.extend('different', {
      getMessage: () => 'Correct interval values must differ.',
      validate: () => (this.correctMin !== this.correctMax)
    });
  },
  methods: {
    setValues(field) {
      console.log('triggered');
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
      if (newMin <= this.correctMin) {
        this.options.min = newMin;
        return;
      }
      if (newMin > this.correctMax) {
        this.value = [newMin, this.options.max];
      } else {
        this.value = [newMin, this.correctMax];
      }
      this.options.min = newMin;
    },
    setMax(value) {
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
      });
      this.update();
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
      const limit = Math.abs(this.options.interval - this.options[limitField]);
      if (field !== 'interval') {
        Object.assign(rules, {[`${limitField}_value`]: limit});
      }
      return rules;
    }
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

.include-flag {
  transform: scale(0.9);
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

.correct-error /deep/ .vue-slider-tooltip {
   background-color: #d43f3a;
   border-color: #d9534f;
}

.slider /deep/ .vue-slider-process {
  background: linear-gradient(left, #5cb85c, #3498db);
}

</style>
