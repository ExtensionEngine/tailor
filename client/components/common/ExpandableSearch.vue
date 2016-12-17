<template>
  <div class="expandable-search">
    <div class="col-sm-9">
      <div class="form-group">
        <input
          type="search"
          class="search form-control"
          placeholder="search..."
          ref="search"
          :class="{ 'search-show': show }"
          @input="handleSearch"
        />
      </div>
    </div>

    <div class="col-sm-3">
      <button
        class="btn btn-link btn-trigger"
        @click="handleShow"
      >
        <span class="fa fa-lg fa-search" v-if="!show"></span>
        <span class="fa fa-lg fa-times" v-if="show"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'expandable-search',

  props: {
    setSearch: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      show: false
    };
  },

  methods: {
    handleShow() {
      this.show = !this.show;
    },
    handleSearch() {
      const search = this.$refs.search.value;
      this.setSearch(search);
    }
  }
};
</script>

<style lang="scss">
$primary-color: #da126d;
$primary-color-active: lighten($primary-color, 10%);
// TODO(marko): search expand direction
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
