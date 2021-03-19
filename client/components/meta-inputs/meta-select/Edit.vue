<template>
  <validation-provider
    ref="validator"
    v-slot="{ errors }"
    :name="meta.label.toLowerCase()"
    :rules="validationRules"
    slim>
    <v-select
      v-model="value"
      @change="update"
      :value="meta.value"
      :name="meta.key"
      :items="meta.options"
      :placeholder="meta.placeholder"
      :label="meta.label"
      :multiple="meta.multiple"
      :chips="meta.multiple"
      :small-chips="!hasImgProp"
      :error-messages="errors"
      item-text="label"
      item-value="value"
      deletable-chips
      outlined>
      <template v-if="hasImgProp" v-slot:item="{ item }">
        <img v-if="item.img" :src="item.img" :alt="item.label" class="img">
        <span>{{ item.label }}</span>
      </template>
      <template v-if="hasImgProp" v-slot:selection="{ item }">
        <component :is="meta.multiple ? 'v-chip' : 'div'">
          <img v-if="item.img" :src="item.img" :alt="item.label" class="img">
          <span>{{ item.label }}</span>
        </component>
      </template>
    </v-select>
  </validation-provider>
</template>

<script>
import get from 'lodash/get';

export default {
  name: 'meta-select',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
  data: vm => ({ value: vm.meta.value }),
  computed: {
    validationRules: vm => get(vm.meta, 'validate.rules', vm.meta.validate),
    hasImgProp: vm => vm.meta.options.some(it => it.img)
  },
  methods: {
    async update(data) {
      const { valid } = await this.$refs.validator.validate();
      if (!valid || this.value === this.meta.value) return;
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
  width: 2rem;
  height: 2rem;
  margin-right: 0.75rem;
}

.v-chip__content .img {
  width: 1.625rem;
  height: 1.625rem;
}
</style>
