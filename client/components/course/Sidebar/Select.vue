<template>
  <div
    :class="{ 'active': active }"
    class="select">
    <label>{{ meta.label }}</label>
    <multiselect
      :value="value"
      :options="options"
      :searchable="false"
      :placeholder="meta.placeholder"
      @open="active = true"
      @close="active = false"
      @input="({ value }) => $emit('update', meta.key, value)">
    </multiselect>
  </div>
</template>

<script>
import find from 'lodash/find';
import Select from '../../common/Select';
const isString = arg => typeof arg === 'string';

export default {
  name: 'multi-select',
  props: ['meta'],
  computed: {
    value() {
      return find(this.options, ({ value }) => value === this.meta.value);
    },
    options() {
      return this.meta.options.map(option => {
        if (isString(option)) {
          return { label: option, value: option };
        }
        return option;
      });
    }
  },
  data() {
    return { active: false };
  },
  components: {
    multiselect: Select
  }
};
</script>

<style lang="scss" scoped>
.select {
  padding: 3px 8px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }

  &.active:hover {
    background-color: inherit;
  }

  label {
    color: #808080;
  }

  .multiselect {
    font-size: 17px;
    line-height: 24px;
    color: #333;
  }
}
</style>
