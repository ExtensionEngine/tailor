<template>
  <div class="expandable-search">
    <div class="col-sm-9">
      <div class="form-group">
        <input
          class="search form-control"
          placeholder="search..."
          :class="{ 'search-show': show }"
          v-model="query"/>
      </div>
    </div>

    <div class="col-sm-3">
      <button
        class="btn btn-link btn-trigger"
        @click="handleShow">
          <span class="fa fa-lg fa-times" v-show="show"></span>
          <span class="fa fa-lg fa-search" v-show="!show"></span>
      </button>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
  name: 'expandable-search',
  data() {
    return {
      query: '',
      show: false
    };
  },
  methods: {
    handleShow() {
      this.show = !this.show;

      // Reset search state when form is hidden
      if (!this.show) this.query = '';
    }
  },
  watch: {
    query: debounce(function () {
      this.$emit('change', this.query);
    }, 500)
  }
};
</script>

<style lang="scss">
$primary-color: #da126d;
$primary-color-active: lighten($primary-color, 10%);

.expandable-search {
  height: 100%;
  width: 100%;

  .search {
    overflow: hidden;
    position: absolute;
    right: 0;
    transition: width 0.5s ease-in-out;
    top: 0;
    width: 0;
  }

  .search-show {
    width: 100%;
  }

  .btn.btn-trigger {
    background-color: $primary-color;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
    color: #fff;
    outline: 0;
    padding: 7px;
    width: 80%;

    &:active {
      background-color: $primary-color-active;
      background-image: radial-gradient(circle, $primary-color-active 10%, $primary-color-active 11%);
    }
  }
}
</style>
