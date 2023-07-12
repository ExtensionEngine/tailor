<template>
  <v-select
    @change="update"
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="meta.multiple"
    :chips="meta.multiple"
    :small-chips="!hasImgProp"
    item-text="label"
    item-value="value"
    deletable-chips
    outlined>
    <template v-if="hasImgProp" #item="{ item }">
      <img v-if="item.img" :src="item.img" :alt="item.label" class="img">
      <span>{{ item.label }}</span>
    </template>
    <template v-if="hasImgProp" #selection="{ item }">
      <component :is="meta.multiple ? 'v-chip' : 'div'">
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
::v-deep {
  .v-list-item__content {
    flex: initial;
  }

  .v-select__slot .v-select__selections {
    min-height: 2.625rem !important;
  }
}

.img {
  margin-right: 0.75rem;
  width: 2rem;
  height: 2rem;
}

.v-chip__content .img {
  width: 1.625rem;
  height: 1.625rem;
}
</style>
