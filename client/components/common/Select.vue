<template>
  <div class="custom-select">
    <multiselect
      @input="val => $emit('input', val)"
      @close="close"
      @open="open"
      :value="value"
      :class="position"
      v-bind="options">
      <slot
        v-for="slot in Object.keys($slots)"
        :slot="slot"
        :name="slot">
      </slot>
      <template
        v-for="slot in Object.keys($scopedSlots)"
        :slot="slot"
        slot-scope="scope">
        <slot v-bind="scope" :name="slot"></slot>
      </template>
    </multiselect>
    <span
      v-if="showResetButton"
      @click="$emit('input', null)"
      type="button"
      class="btn-close mdi mdi-close">
    </span>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
  name: 'v-select',
  inheritAttrs: false,
  props: {
    value: { type: [Object, Array, String, Number], default: null },
    inputPlacement: { type: String, default: 'bottom' },
    showReset: { type: Boolean, default: false }
  },
  data() {
    return { isOpen: false };
  },
  computed: {
    options() {
      return Object.assign({
        closeOnSelect: true,
        showLabels: false,
        placeholder: 'Select option',
        trackBy: this.$attrs['track-by'] || 'label',
        label: 'label'
      }, this.$attrs);
    },
    position() {
      return this.inputPlacement !== 'bottom' ? 'search-top' : '';
    },
    showResetButton() {
      return this.showReset && !this.isOpen && this.value;
    }
  },
  methods: {
    open(val, id) {
      this.isOpen = true;
      this.$emit('open', val, id);
    },
    close(id) {
      this.isOpen = false;
      this.$emit('close', id);
    }
  },
  components: { Multiselect }
};
</script>

<style lang="scss">
@import '~vue-multiselect/dist/vue-multiselect.min';

.custom-select {
  position: relative;

  .btn-close {
    position: absolute;
    top: 10px;
    right: 20px;
    padding: 5px;
    box-shadow: none;
    color: #999;
    background: none;
    cursor: pointer;
  }
}

.custom-select .multiselect {
  width: auto;
  padding-top: 8px;
  padding-right: 24px;
  color: #555;
  font-size: 14px;

  &:focus {
    box-shadow: inset 0 -2px 0 #337ab7;
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

    &--disabled {
      color: #444;
      background: #dfdfdf;
    }
  }

  .multiselect__content-wrapper {
    margin-top: -1px;
    background-color: #fff;
    border: 1px solid #999;
    border-radius: 0;
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
    color: #4a4a4a;
    line-height: 24px;
    background: #e0e0e0;
    cursor: default;

    &:hover {
      color: #fbfafb;
      background: #767577;
    }

    span {
      display: block;
      float: left;
      max-width: 286px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 12px;
      line-height: 27px;
      font-family: $font-family-secondary;
    }
  }

  .multiselect__tag-icon {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    width: 20px;
    margin: 0 4px;
    line-height: 24px;
    overflow: hidden;
    cursor: pointer;

    &:hover, &:focus { background: none; }

    &::after {
      content: "\F159";
      display: inline-block;
      color: #9c9c9c;
      font-size: 18px;
      font-family: $font-family-icons;
      font-weight: normal;
      line-height: 26px;
      font-style: normal;
      letter-spacing: normal;
      text-transform: none;
      text-align: center;
      cursor: pointer;
    }
  }

  .multiselect__tag:hover .multiselect__tag-icon {
    &::after { color: #fbfafb; }
  }

  .multiselect__select {
    top: 8px;
    bottom: 1px;
    width: 20px;
    height: 34px;
    padding: 0;
    transition: none;
  }

  .multiselect__single, .multiselect__tags {
    margin-bottom: 0;
    padding-left: 0;
    line-height: 34px;
  }

  .multiselect__input, .multiselect__single, .multiselect__tags {
    font-size: inherit;
    background: none;
    border: 0;
    border-radius: 0;
  }

  .multiselect__input {
    margin: 0;
    padding-left: 10px;
    line-height: 32px;
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

  .multiselect__select { bottom: unset; }
}
</style>
