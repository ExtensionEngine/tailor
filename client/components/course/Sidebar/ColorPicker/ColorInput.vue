<template>
  <div class="input">
    <color-picker v-model="color"></color-picker>
    <div class="actions">
      <button
        @click="$emit('close')"
        type="button"
        class="btn btn-default btn-cancel">
        Cancel
      </button>
      <button
        @click="submit(color)"
        type="button"
        class="btn btn-primary btn-submit">
        Submit
      </button>
    </div>
  </div>
</template>

<script>
import { Chrome as ColorPicker } from 'vue-color';

export default {
  props: ['value'],
  data() {
    return {
      color: { hex: this.value || '#ffffff' }
    };
  },
  methods: {
    submit(color) {
      this.$emit('input', color.hex);
      this.$emit('close');
    }
  },
  components: { ColorPicker }
};
</script>

<style lang="scss" scoped>
.btn {
  margin-right: 5px;
  padding: 6px 16px;
  font-family: "Roboto";
  font-size: 12.5px;
  font-weight: 500;
  outline: none;
}

.input {
  text-align: center;

  .actions {
    display: inline-block;
    padding-top: 8px;

    .btn {
      margin-right: 5px;
    }
  }
}

.vue-color__chrome {
  margin: 0 auto;
  box-shadow: none;
  border-radius: 3px;
  background: transparent;
  overflow: hidden;
}

.vue-color__chrome /deep/ .vue-color__chrome {
  &__chrome-body {
    padding: 12px 16px 12px;
    background: transparent;
  }

  &__controls {
    display: block;
  }

  &__color-wrap {
    float: left;
  }

  &__sliders {
    padding: 8px 0 0 40px;
  }

  &__alpha-wrap, &__toggle-btn {
    display: none;
  }

  &__active-color {
    width: 24px;
    height: 24px;
    margin-top: 2px;
    border-radius: 50%;
  }
}

.vue-color__chrome /deep/ .vue-color__editable-input {
  &__label {
    display: none;
    color: #222;
  }

  &__input {
    height: 24px;
    font-family: "Roboto";
    font-size: 13px;
    color: #222;
    background: #fdfdfd;
  }
}
</style>
