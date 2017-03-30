<template>
  <multiselect 
    @input="onChange"
    :value="value" 
    :options="options" 
    :searchable="searchable" 
    :close-on-select="true" 
    :show-labels="false" 
    :allow-empty="false"
    :id="id"
    track-by="name" 
    label="name">
  </multiselect>
</template>

<script>
import multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

export default {
  name: 'select',
  props: ['value', 'options', 'searchable', 'onChange'],
  data() {
    return {
      isFocused: false,
      id: this._uid
    };
  },
  components: {
    multiselect
  }
};
</script>

<style lang="scss">
.multiselect {
  font-size: 16px !important;
  font-family: 'Catamaran', Helvetica, Arial, sans-serif !important;
  color: #555555 !important;
  height: 34px !important;
  // min-width: 200px !important;
  min-height: 0 !important;
  
  &:focus {
    box-shadow: inset 0 -2px 0 #337AB7;
    transition: box-shadow 0.15s;
  }

  .multiselect__option--selected {
    background: none !important;
  }

  .multiselect__option--highlight {
    background: #5897fb !important;
  }
}

.multiselect__content {
  background: #E0E0E0 !important;
  border: 1px solid #999999 !important;
  border-radius: 0px !important;
}

.multiselect__tags {
  min-height: 0 !important;
  padding: 0px !important;
  height: 100%;
}
.multiselect__select {
  min-height: 0 !important;
  padding: 0px !important;
  width: 20px !important;
  height: 34px !important;
}

.multiselect__single {
  line-height: 34px !important;
  padding-left: 0px !important;
  margin-bottom: 0px !important;
}

.multiselect__input, .multiselect__single, .multiselect__tags {
  background: none !important;
  border: 0 !important;
  border-radius: 0 !important;
  font-size: inherit !important;
}
</style>
