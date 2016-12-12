<template>
  <div class="form-group courses-search">
    <input
      type="search"
      class="form-control"
      placeholder="search..."
      @input="handleSearch($event)"
    />
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { debounce } from 'lodash';

  export default {
    name: 'courses-search',

    computed: {
      ...mapGetters({
        filters: 'getFilters'
      })
    },

    methods: {
      handleSearch(event) {
        const value = event.target.value;
        const search = value.length >= 2 ? value : '';

        debounce(this.setSearchFilter, 800)(search);
      },
      ...mapActions([
        'setSearchFilter'
      ])
    }
  };
</script>

<style lang="scss">
  .courses-search {
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.74);
    margin: 0 auto;
    max-width: 80%;
    width: 600px;

    .form-control {
      font-size: 18px;
      padding: 0 5px;
      height: 45px;
      line-height: 32px;
      text-indent: 5px;

      &:focus {
        box-shadow: none;
      }
    }
  }
</style>
