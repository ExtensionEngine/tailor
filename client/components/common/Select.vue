<template>
  <multiselect
    :value="value"
    :options="options"
    :searchable="searchable"
    :close-on-select="true"
    :show-labels="false"
    :allow-empty="allowEmpty"
    :multiple="multiple"
    :disabled="disabled"
    :placeholder="placeholder || 'Select option'"
    :track-by="trackBy || 'label'"
    :label="label || 'label'"
    :class="{ 'search-top': inputPlacement !== 'bottom' }"
    @input="val => $emit('input', val)"
    @close="id => $emit('close', id)"
    @open="(value, id) => $emit('open', value, id)"
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
    'multiple',
    'disabled',
    'placeholder',
    'trackBy',
    'label',
    'allowEmpty',
    'inputPlacement'
  ],
  components: { multiselect }
};
</script>

<style lang="scss">
.custom-select.multiselect {
  width: auto;
  padding-right: 24px;
  font-size: 14px;
  font-family: 'Catamaran', Helvetica, Arial, sans-serif;
  color: #555;

  &:focus {
    box-shadow: inset 0 -2px 0 #337AB7;
    transition: box-shadow 0.15s;
  }

  .multiselect__option {
    &--selected {
      background: none;
    }

    &--highlight {
      color: #444;
      background-color: #eee;
    }
  }

  .multiselect__content-wrapper {
    margin-top: -1px;
    border: 1px solid #999;
    border-radius: 0;
    background-color: #fff;
  }

  .multiselect__tags {
    width: 100%;
    height: 100%;
    padding: 0;

    &-wrap {
      width: 100%;
    }
  }

  .multiselect__tag {
    height: 32px;
    padding: 0;
    padding-left: 12px;
    border-radius: 32px;
    line-height: 32px;
    cursor: default;
    background: #337ab7;
    color: #fff;

    &:hover {
      background: #1a4265;
      color: #d5d5d5;;
    }

    span {
      display: inline-block;
      position: relative;
      top: -1px;
      line-height: 32px;
    }
  }

  .multiselect__tag-icon {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    line-height: 32px;
    overflow: hidden;
    margin: 0 6px;
    cursor: pointer;

    &:hover, &:focus { background: none; }

    &::after {
      content: "\F159"; // close-circle
      display: inline-block;
      line-height: 32px;
      font-size: 20px;
      font-family: "Material Design Icons";
      font-weight: normal;
      font-style: normal;
      letter-spacing: normal;
      text-transform: none;
      text-align: center;
      color: #fff;
      cursor: pointer;
    }
  }

  .multiselect__tag:hover .multiselect__tag-icon  {
    &::after { color: #d5d5d5; }
  }

  .multiselect__select {
    width: 20px;
    height: 34px;
    padding: 0;
  }

  .multiselect__single, .multiselect__tags {
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

  .multiselect__input {
    width: 100% !important;
    margin: 0;
    line-height: 32px;
  }

  .multiselect__select {
    top: unset;
    bottom: 1px;
  }
}

.custom-select.multiselect.search-top {
  .multiselect__tags {
    display: table;
    &-wrap { display: table-footer-group; }
  }

  .multiselect__input {
    display: table-header-group;
    margin-bottom: 8px;
  }

  .multiselect__select {
    top: 1px;
    bottom: unset;
  }
}

</style>
