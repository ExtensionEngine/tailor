<template>
  <div
    :class="{ active }"
    class="select">
    <label :for="meta.key">{{ meta.label }}</label>
    <multiselect
      :value="value"
      :name="meta.key"
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
import isString from 'lodash/isString';
import Select from '../../common/Select';

export default {
  name: 'multi-select',
  props: ['meta'],
  computed: {
    value() {
      return find(this.options, { value: this.meta.value });
    },
    options() {
      const { options } = this.meta;
      return options.map(it => isString(it) ? { label: it, value: it } : it);
    }
  },
  data() {
    return { active: false };
  },
  components: { multiselect: Select }
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
