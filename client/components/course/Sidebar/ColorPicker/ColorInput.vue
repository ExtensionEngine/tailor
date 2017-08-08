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
</style>

<style lang="scss">
.c-chrome {
  margin: 0 auto;
  box-shadow: none !important;
  border-radius: 3px !important;
  background: transparent !important;
  overflow: hidden;

  .chrome-body {
    padding: 12px 16px 12px !important;
    background: transparent;

    .controls {
      display: block;

      .color-wrap {
        float: left;

        .active-color {
          width: 24px;
          height: 24px;
          margin-top: 2px;
          border-radius: 50%;
        }
      }

      .sliders {
        padding: 8px 0 0 40px;

        .alpha-wrap {
          display: none;
        }
      }
    }

    .fields-wrap {
      .fields {
        .field {
          .editable-input {
            .input__label {
              display: none;
              color: #222;
            }

            .input__input {
              height: 24px;
              font-family: "Roboto";
              font-size: 13px;
              color: #222;
              background: #fdfdfd;
            }
          }
        }
      }

      .toggle-btn {
        display: none;
      }
    }
  }
}
</style>
