<template>
  <div class="course-search">
    <div class="input-group">
      <input
        class="form-control"
        placeholder="Search..."
        v-model="query"/>
      <span class="input-group-btn">
        <button v-show="query" type="button" class="btn input-action" @click="clearSearch">
          <span v-show="spinner" class="fa fa-refresh fa-spin fa-2x fa-fw"></span>
          <span v-show="!spinner" class="fa fa-2x fa-times" aria-hidden="true"></span>
        </button>
        <div v-show="!query" class="input-group-placeholder"></div>
      </span>
    </div>
  </div>
</template>

<script>
import { debounce } from 'lodash';

export default {
  name: 'search',
  data() {
    return {
      query: ''
    };
  },
  methods: {
    clearSearch() {
      this.query = '';
    }
  },
  watch: {
    query: debounce(function search() {
      this.$emit('change', this.query);
    }, 500)
  },
  props: {
    spinner: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="scss">
.course-search {
  width: 500px;
  margin: 0 auto;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.34);

  .input-group-placeholder {
    box-shadow: inset 0 -1px 0 #ddd;
    height: 45px;
    width: 20px;
  }

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

  .form-control:focus + .input-group-btn > .input-group-placeholder {
    // Follow input box shadow
    box-shadow: none;
  }

  .input-group-btn {
    background-color: #fff;
  }

  .input-action {
    background-color: transparent;
    border: 0;
    border-radius: 0;
    box-shadow: none;
    height: 44px;

    &:hover {
      background-color: #fff;
    }

    &:active {
      border-color: transparent;
      outline: 0;
    }
  }
}
</style>
