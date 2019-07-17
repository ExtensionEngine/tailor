<template>
  <div class="repo-search">
    <div :style="{ width: expanded ? '100%' : '95%' }">
      <v-text-field
        v-focus="expanded"
        v-model.trim="query"
        @focus="expanded = true"
        @blur="expanded = false"
        @input="emitChange"
        prepend-inner-icon="mdi-magnify"
        solo
        clearable
        placeholder="Search..."/>
    </div>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import focus from 'vue-focus';

export default {
  data() {
    return {
      query: '',
      expanded: false
    };
  },
  methods: {
    emitChange: debounce(function () {
      this.$emit('change', this.query);
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
