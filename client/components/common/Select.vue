<template>
  <div class="custom-select">
    <multiselect
      :value="value"
      :class="{ 'search-top': inputPlacement !== 'bottom' }"
      v-bind="options"
      @input="val => $emit('input', val)"
      @close="close"
      @open="open">
    </multiselect>
    <span
      v-if="showResetBtn"
      @click="$emit('input', null)"
      type="button"
      class="mdi mdi-close">
    </span>
  </div>
</template>

<script>
import multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'select',
  inheritAttrs: true,
  props: [
    'value',
    'inputPlacement',
    'showReset'
  ],
  data() {
    return { selecting: false };
  },
  computed: {
    options() {
      return Object.assign({
        closeOnSelect: true,
        showLabels: false,
        placeholder: 'Select option',
        trackBy: 'label',
        label: 'label'
      }, this.$attrs);
    },
    showResetBtn() {
      return this.showReset && !this.selecting && this.value;
    }
  },
  methods: {
    open(val, id) {
      this.selecting = true;
      this.$emit('open', val, id);
    },
    close(id) {
      this.selecting = false;
      this.$emit('close', id);
    }
  },
  components: { multiselect }
};
</script>

<style lang="scss">
.custom-select {
  position: relative;

  .mdi.mdi-close {
    position: absolute;
    top: 3px;
    right: 20px;
    padding: 5px;
    box-shadow: none;
    background: none;
    color: #999;
    cursor: pointer;
  }
}

.custom-select .multiselect {
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

    &-wrap { width: 100%; }
  }

  .multiselect__tag {
    height: 26px;
    padding: 0;
    padding-left: 12px;
    border-radius: 26px;
    line-height: 26px;
    cursor: default;
    background: #e0e0e0;
    color: #4a4a4a;

    &:hover {
      background: #767577;
      color: #fbfafb;
    }

    span {
      display: block;
      float: left;
      max-width: 286px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      font-family: "Roboto";
    }
  }

  .multiselect__tag-icon {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    line-height: 26px;
    overflow: hidden;
    margin: 0 4px;
    cursor: pointer;

    &:hover, &:focus { background: none; }

    &::after {
      content: "\F159"; // close-circle
      display: inline-block;
      line-height: 26px;
      font-size: 18px;
      font-family: "Material Design Icons";
      font-weight: normal;
      font-style: normal;
      letter-spacing: normal;
      text-transform: none;
      text-align: center;
      color: #9c9c9c;
      cursor: pointer;
    }
  }

  .multiselect__tag:hover .multiselect__tag-icon  {
    &::after { color: #fbfafb; }
  }

  .multiselect__select {
    width: 20px;
    height: 34px;
    padding: 0;
    transition: none;
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

.custom-select .multiselect.search-top {
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
