<template>
  <div class="form-group courses-search">
    <input
      type="search"
      class="form-control"
      placeholder="Search..."
      @input="handleSearch($event)"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { debounce } from 'lodash';

export default {
  name: 'courses-search',
  computed: mapGetters({
    filters: 'getFilters'
  }),
  methods: {
    ...mapActions(['setSearchFilter']),
    handleSearch({ target }) {
      const value = target.value;
      const search = value.length >= 2 ? value : '';
      debounce(this.setSearchFilter, 800)(search);
    }
  }
};
</script>

<style lang="scss">
.courses-search {
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
