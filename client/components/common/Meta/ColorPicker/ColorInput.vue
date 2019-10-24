<template>
  <div class="input">
    <color-picker v-model="color" />
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
import ColorPicker from 'vue-color/src/components/Chrome';

export default {
  props: {
    value: { type: String, required: true }
  },
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
  font-family: $font-family-secondary;
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

.input /deep/ .c-chrome {
  margin: 0 auto;
  box-shadow: none;
  border-radius: 3px;
  background: transparent;
  overflow: hidden;

  .chrome-body {
    padding: 12px 16px !important;
    background: transparent;
  }

  .controls {
    display: block;
  }

  .color-wrap {
    float: left;
  }

  .active-color {
    width: 24px;
    height: 24px;
    margin-top: 2px;
    border-radius: 50%;
  }

  .sliders {
    padding: 8px 0 0 40px;
  }

  .container {
    width: 100%;
  }

  .alpha-wrap {
    display: none;
  }

  .input__label {
    display: none;
    color: #222;
  }

  .input__input {
    height: 24px;
    color: #222;
    font-family: $font-family-secondary;
    font-size: 13px;
    background: #fdfdfd;
  }

  .toggle-btn {
    display: none;
  }
}
</style>
