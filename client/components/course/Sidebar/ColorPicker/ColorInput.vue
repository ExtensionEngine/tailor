<template>
  <div class="input">
    <color-picker v-model="color">
    </color-picker>
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
    return { color: { hex: this.value || '#ffffff' } };
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
  padding: 6px 16px;
  margin-right: 5px;
  font-family: "Roboto";
  font-size: 12.5px;
  font-weight: 500;
  outline: none;
}

.input {
  text-align: center;
  padding: 10px 0;

  .actions {
    display: inline-block;
    padding-top: 10px;

    .btn { margin-right: 5px; }
  }
}

.vue-color__chrome {
  margin: 0 auto;
  box-shadow: none;
  border-radius: 3px;
  background: transparent;
  overflow: hidden;
}

.vue-color__chrome /deep/ .vue-color {
  &__chrome__chrome-body { background: transparent; }

  &__chrome__active-color {
    margin-top: 2px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  &__editable-input__label {
    color: #222;
  }
  &__editable-input__input {
    background: #efefef;
    color: #222;
  }
}
</style>
