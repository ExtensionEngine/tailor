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
      @input="update">
    </multiselect>
  </div>
</template>

<script>
import find from 'lodash/find';
import get from 'lodash/get';
import isString from 'lodash/isString';
import Select from '../../common/Select';

export default {
  name: 'multi-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data() {
    return { active: false };
  },
  computed: {
    value() {
      return find(this.options, { value: this.meta.value });
    },
    options() {
      const { options } = this.meta;
      return options.map(it => isString(it) ? { label: it, value: it } : it);
    }
  },
  methods: {
    update(data) {
      return this.$emit('update', this.meta.key, get(data, 'value', null));
    }
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
    color: #333;
    font-size: 17px;
    line-height: 24px;
  }
}
</style>
