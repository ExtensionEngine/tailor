<template>
  <div class="course-search">
    <div class="input-group">
      <input
        v-model="query"
        class="form-control"
        placeholder="Search..."/>
      <span class="input-group-btn">
        <button v-show="query" type="button" class="btn">
          <span
            v-show="spinner"
            class="fa fa-refresh fa-spin">
          </span>
          <span
            v-show="!spinner"
            @click="query = ''"
            class="fa fa-times">
          </span>
        </button>
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
  watch: {
    query: debounce(function () {
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

<style lang="scss" scoped>
.course-search {
  width: 500px;
  margin: 0 auto;

  .input-group {
    width: 100%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .form-control {
    height: 45px;
    padding: 0 7px;
    font-size: 18px;
    text-indent: 10px;
    box-shadow: none;
  }

  .input-group-btn {
    background-color: #fff;
  }

  button {
    background-color: white;
    box-shadow: none;

    &:focus {
      outline: none;
    }

    .fa {
      color: #666;
      font-size: 18px;

      &:hover {
        color: #444;
      }
    }
  }
}
</style>
