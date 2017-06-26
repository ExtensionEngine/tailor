<template>
  <multiselect
    :value="value"
    :options="options"
    :searchable="searchable"
    :close-on-select="true"
    :show-labels="false"
    :allow-empty="false"
    :disabled="disabled"
    :placeholder="placeholder || 'Select option'"
    :track-by="trackBy || 'label'"
    :label="label || 'label'"
    @input="onChange"
    class="custom-select">
  </multiselect>
</template>

<script>
import multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'select',
  props: [
    'value',
    'options',
    'searchable',
    'disabled',
    'placeholder',
    'trackBy',
    'label',
    'onChange'
  ],
  components: { multiselect }
};
</script>

<style lang="scss">
.custom-select.multiselect {
  height: 34px;
  font-size: 14px;
  font-family: 'Catamaran', Helvetica, Arial, sans-serif;
  color: #555;

  &:focus {
    box-shadow: inset 0 -2px 0 #337AB7;
    transition: box-shadow 0.15s;
  }

  .multiselect__option--selected {
    background: none;
  }

  .multiselect__option--highlight {
    color: #444;
    background-color: #eee;
  }

  .multiselect__content {
    border: 1px solid #999;
    border-radius: 0;
    background-color: #fff;
  }

  .multiselect__tags {
    height: 100%;
    padding: 0;
  }

  .multiselect__select {
    width: 20px;
    height: 34px;
    padding: 0;
  }

  .multiselect__single {
    padding-left: 0;
    margin-bottom: 0;
    line-height: 34px;
  }

  .multiselect__input, .multiselect__single, .multiselect__tags {
    border: 0;
    border-radius: 0;
    font-size: inherit;
    background: none;
  }
}
</style>
