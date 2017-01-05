<template>
  <div class="course-search">
    <div :class="inputClass">
      <input
        class="form-control"
        placeholder="Search..."
        v-model="input"
      />
      <span v-if="input" class="input-group-btn">
        <button
          type="button"
          class="btn input-action"
          @click="searchReset"
        >
          <span class="fa fa-lg fa-times" aria-hidden="true"></span>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex-module';
import { debounce } from 'lodash';

export default {
  name: 'search',
  props: {
    search: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      input: ''
    };
  },
  computed: {
    inputClass() {
      return this.input.length ? 'input-group' : 'form-group';
    }
  },
  methods: {
    ...mapMutations(['setSearch'], 'courses'),
    searchReset() {
      this.input = '';

      this.setSearch('');
      this.search('');
    }
  },
  beforeDestroy() {
    // state cleanup
    this.setSearch('');
  },
  watch: {
    input: debounce(function() {
      this.setSearch(this.input);
      this.search(this.input);
    }, 1000)
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
