<template>
  <div class="repo-search">
    <div :style="{ width: expanded ? '100%' : '95%' }">
      <v-text-field
        v-focus="expanded"
        @focus="expanded = true"
        @blur="expanded = false"
        @input="emitChange"
        :value="value"
        prepend-inner-icon="mdi-magnify"
        solo
        clearable
        placeholder="Search..." />
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import focus from 'vue-focus';

export default {
  props: {
    value: { type: String, default: null }
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    emitChange: debounce(function (val) {
      this.$emit('update', val && val.trim());
    }, 500)
  },
  directives: focus
};
</script>

<style lang="scss" scoped>
.repo-search {
  > div {
    margin: 0 auto;
    transition: width 0.3s ease;
  }
}
</style>
