<template>
  <div :class="{ editing: isOpen }" class="datepicker">
    <label :for="meta.key">{{ meta.label }}</label>
    <div class="control-group">
      <input
        v-model="value"
        @click="showPicker"
        :id="meta.key"
        :name="meta.key"
        :disabled="isOpen"
        :placeholder="dateFormat"
        type="text"
        class="form-control">
      <div ref="picker" class="picker"></div>
    </div>
  </div>
</template>

<script>
import Datepicker from 'md-date-time-picker';
import debounce from 'lodash/debounce';
import get from 'lodash/get';

const { CustomEvent } = window;

const fillText = Datepicker.prototype._fillText;
Datepicker.prototype._fillText = function () {
  if (this._trigger) {
    const date = get(this, '_sDialog.sDate');
    const e = new CustomEvent('onSelect', { detail: { date } });
    this._trigger.dispatchEvent(e);
  }
  return fillText.apply(this, arguments);
};

export default {
  name: 'DatePicker',
  props: ['meta'],
  computed: {
    dateFormat() {
      return this.meta.format || 'MM/DD/YYYY';
    },
    picker() {
      return this.$refs.picker;
    }
  },
  data() {
    return {
      isOpen: false,
      value: this.meta.value
    };
  },
  mounted() {
    this.datepicker = new Datepicker({
      type: 'date',
      orientation: 'PORTRAIT',
      trigger: this.picker
    });
    this.datepicker.hide();
    const $datepicker = document.body.getElementsByClassName('mddtp-picker')[0];
    this.datepicker.$el = this.picker.appendChild($datepicker);
    this.picker.addEventListener('onOk', this.onOk);
    this.picker.addEventListener('onCancel', this.onCancel);
  },
  beforeDestroy() {
    if (!this.picker) return;
    this.picker.removeEventListener('onOk', this.onOk);
    this.picker.removeEventListener('onCancel', this.onCancel);
  },
  methods: {
    onSelect(e) {
      const date = get(e, 'detail.date');
      if (date) this.value = date.format(this.dateFormat);
    },
    onOk() {
      this.onPickerHide();
      this.value = this.datepicker.time.format(this.dateFormat);
    },
    onCancel() {
      this.onPickerHide();
    },
    showPicker: debounce(function () {
      if (this.datepicker.isOpen()) return;
      this.isOpen = true;
      this.datepicker.show();
      this.picker.addEventListener('onSelect', this.onSelect);
    }, 250),
    onPickerHide() {
      this.isOpen = false;
      this.picker.removeEventListener('onSelect', this.onSelect);
    }
  }
};
</script>

<style lang="scss">
@import "~md-date-time-picker/src/scss/dependencies/color-definitions";
$primary-color-palette: $palette-blue;
$picker-images-base-path: "~md-date-time-picker/dist/images/";

@import "~md-date-time-picker/src/scss/component";

.mddtp-picker.animated {
  animation-duration: 0.3s;
}
</style>

<style lang="scss" scoped>
.datepicker {
  padding: 3px 8px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &.editing:hover {
    background-color: inherit;
  }
}

label {
  color: #808080;
}

.control-group {
  margin: 5px 3px 15px 0;
  color: #333;
  line-height: 24px;
  word-wrap: break-word;

  input {
    font-size: 17px;
    background: none;
    border: none;
    box-shadow: none;
    cursor: pointer;

    .editing & {
      box-shadow: inset 0 -2px 0 #337ab7;
    }
  }
}

.picker {
  position: relative;

  /deep/ .mddtp-picker {
    position: absolute;
    top: 0;
    left: 0;
    transform: none;
    margin: 5px 0 20px;
  }
}
</style>
