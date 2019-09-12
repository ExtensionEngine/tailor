<template>
  <div
    :class="{ active }"
    class="select">
    <label :for="meta.key">{{ meta.label }}</label>
    <multiselect
      @open="active = true"
      @close="active = false"
      @input="update"
      :value="value"
      :name="meta.key"
      :options="options"
      :searchable="false"
      :placeholder="meta.placeholder"
      :multiple="isMultiSelect">
      <template slot="option" slot-scope="{ option }">
        <img v-if="option.img" :src="option.img" :alt="option.label" class="img">
        <span>{{ option.label }}</span>
      </template>
      <template slot="singleLabel" slot-scope="{ option }">
        <img v-if="option.img" :src="option.img" :alt="option.label" class="img">
        <span>{{ option.label }}</span>
      </template>
    </multiselect>
  </div>
</template>

<script>
import isString from 'lodash/isString';
import Select from '@/components/common/Select';

export default {
  name: 'base-meta-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: () => ({ active: false }),
  computed: {
    isMultiSelect: () => {
      throw new Error('Computed "isMultiSelect" must be implemented');
    },
    value: () => {
      throw new Error('Computed "value" must be implemented');
    },
    options() {
      const { options } = this.meta;
      return options.map(it => isString(it) ? { label: it, value: it } : it);
    }
  },
  methods: {
    parseInput() {
      throw new Error('Method "parseInput" must be implemented');
    },
    update(data) {
      const payload = this.parseInput(data);
      return this.$emit('update', this.meta.key, payload);
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

  .img {
    width: 36px;
    height: 36px;
    margin-right: 15px;
  }

  /deep/ .multiselect {
    color: #333;
    font-size: 17px;
    line-height: 24px;
  }
}
</style>
