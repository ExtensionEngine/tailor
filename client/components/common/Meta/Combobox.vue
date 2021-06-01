<template>
  <v-combobox
    @change="$emit('update', meta.key, $event)"
    :value="meta.value"
    :name="meta.key"
    :items="meta.options"
    :placeholder="meta.placeholder"
    :label="meta.label"
    :multiple="meta.multiple"
    :chips="meta.multiple"
    item-text="label"
    item-value="value"
    deletable-chips
    outlined
    class="tailor-combobox" />
</template>

<script>
export default {
  name: 'meta-combobox',
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  }
};
</script>

<style lang="scss" scoped>
.tailor-combobox {
  ::v-deep .v-chip {
    height: initial;
    padding: 6px 12px;
    white-space: normal;
  }
}
</style>
