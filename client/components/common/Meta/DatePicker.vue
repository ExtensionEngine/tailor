<template>
  <div class="datepicker control">
    <span class="title">{{ meta.label }}</span>
    <div class="form-group">
      <datetime
        v-model="value"
        @input="value => $emit('update', meta.key, value)"
        :type="type"
        :input-class="'form-control'" />
    </div>
  </div>
</template>

<script>
import 'vue-datetime/dist/vue-datetime.css';
import { Datetime } from 'vue-datetime';

export default {
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return { value: this.meta.value };
  },
  computed: {
    type() {
      return this.meta.type.toLowerCase();
    }
  },
  components: { Datetime }
};
</script>

<style lang="scss" scoped>
$primary: #455a64;
$primary-lighten: #768c97;

.control {
  padding: 7px 8px;

  &:hover {
    background-color: #f5f5f5;
  }

  ::v-deep {
    .vdatetime-input {
      cursor: pointer;
    }

    .form-control {
      background-color: inherit;
      box-shadow: none;
    }

    .vdatetime-popup__header,
    .vdatetime-calendar__month__day--selected span > span {
      background: $primary;
    }

    .vdatetime-time-picker__item,
    .vdatetime-month-picker__item,
    .vdatetime-year-picker__item {
      color: $primary-lighten;
    }

    .vdatetime-popup__actions__button,
    .vdatetime-time-picker__item--selected,
    .vdatetime-month-picker__item--selected,
    .vdatetime-year-picker__item--selected {
      color: $primary;
    }
  }
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}
</style>
