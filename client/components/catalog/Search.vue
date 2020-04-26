<template>
  <div class="repo-search">
    <div :style="{ width: expanded ? '100%' : '95%' }">
      <v-text-field
        v-focus="expanded"
        @focus="expanded = true"
        @blur="expanded = false"
        @input="emitChange"
        :value="value"
        :background-color="`blue-grey darken-${expanded ? 2 : 4}`"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search..."
        clearable hide-details solo dark
        class="pb-5" />
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
