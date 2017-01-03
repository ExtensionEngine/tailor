<template>
  <div class="course-search">
    <input
      class="form-control"
      placeholder="Search..."
      ref="search"
      @input="search($event)"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex-module';
import { debounce } from 'lodash';

export default {
  name: 'search',
  methods: {
    ...mapActions(['setSearch'], 'courses'),
    search: debounce(function() {
      const search = this.$refs.search.value;
      this.setSearch(search);
    }, 1000)
  },
  beforeDestroy() {
    // state cleanup
    this.setSearch('');
  }
};
</script>

<style lang="scss">
.course-search {
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.34);

  .form-control {
    height: 45px;
    padding: 0 5px;
    font-size: 18px;
    line-height: 32px;
    text-indent: 5px;

    &:focus {
      box-shadow: none;
    }
  }
}
</style>
