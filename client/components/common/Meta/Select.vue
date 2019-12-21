<template>
  <v-select
    @change="update"
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="isMultiSelect"
    :chips="isMultiSelect"
    item-text="label"
    item-value="value"
    deletable-chips
    outlined>
    <template v-if="hasImgProp" v-slot:item="{ item }">
      <img v-if="item.img" :src="item.img" :alt="item.label" class="img">
      <span>{{ item.label }}</span>
    </template>
    <template v-if="hasImgProp" v-slot:selection="{ item }">
      <component :is="isMultiSelect ? 'v-chip' : 'div'">
        <img v-if="item.img" :src="item.img" :alt="item.label" class="img">
        <span>{{ item.label }}</span>
      </component>
    </template>
  </v-select>
</template>

<script>
import isObject from 'lodash/isObject';

export default {
  name: 'meta-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  computed: {
    isMultiSelect() {
      return this.meta.type === 'MULTISELECT';
    },
    value() {
      const { meta: { value, options } } = this;
      const hasPrimitiveOptions = !isObject(options[0]);
      if (hasPrimitiveOptions) return value;
      return value.map(val => options.find(it => it.value === val));
    },
    hasImgProp() {
      return this.meta.options.some(it => it.img);
    }
  },
  methods: {
    update(data) {
      return this.$emit('update', this.meta.key, data);
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-list-item__content {
  flex: initial;
}

.img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.v-chip__content .img {
  width: 26px;
  height: 26px;
}
</style>
