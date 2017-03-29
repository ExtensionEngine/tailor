<template>
  <v-select
    :value="value"
    :options="options" 
    :searchable="searchable"
    :onChange="onChange"
    :placeholder="'Activity Level'"
    :class="{ focused: isFocused }"
    :id="id">
  </v-select>
</template>

<script>
import vSelect from 'vue-select';

export default {
  name: 'select',
  props: ['value', 'options', 'searchable', 'onChange', 'placeholder'],
  data() {
    return {
      isFocused: false,
      id: this._uid
    };
  },
  components: {
    vSelect
  },
  mounted() {
    var elSearch = document.getElementById(this.id).getElementsByTagName('input')[0];
    elSearch.onfocus = () => { this.isFocused = true; };
    elSearch.onblur = () => { this.isFocused = false; };
  }
};
</script>

<style lang="scss">
.v-select {
  border: 0px !important;
  font-size: 16px !important;
  font-family: 'Catamaran', Helvetica, Arial, sans-serif !important;

  &.focused {
    box-shadow: inset 0 -2px 0 #337AB7;
    transition: box-shadow 0.15s;
  }

  .dropdown-toggle {
    border: 0px !important;

    input {
      padding: 0px !important;
    }
  }

  .dropdown-menu {
    background: #E0E0E0 !important;
    overflow: auto !important;

    li {
      a {
        font-size: 16px !important;
        color: #555555 !important;
        padding: 5px 10px !important;
      }

      &.active > a {
        background: none !important;

        &:hover{
          background: #5897fb !important;
        }
      }
    }
  }

  .selected-tag {
    background: none !important;
    border: 0px !important;
    color: #555555 !important;
    font-family: 'Catamaran', Helvetica, Arial, sans-serif !important;
    padding: 0px !important;
    margin: 6px 10px 0px 0px !important;
  }
}

</style>
