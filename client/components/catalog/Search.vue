<template>
  <div class="course-search">
    <div class="input-group" :style="{ width: expanded ? '100%' : '80%' }">
      <span class="input-group-btn">
        <button
          v-show="!query"
          @mousedown.prevent="expand = true"
          type="button"
          class="btn">
          <span class="mdi mdi-magnify"></span>
        </button>
        <button
          v-show="query"
          @mousedown.prevent="query = ''"
          type="button"
          class="btn">
          <span class="mdi mdi-close"></span>
        </button>
      </span>
      <input
        v-model.trim="query"
        v-focus="expanded"
        @focus="expanded = true"
        @blur="expanded = false"
        class="form-control"
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
  watch: {
    query() {
      this.emitChange();
    }
  },
  directives: focus
};
</script>

<style lang="scss" scoped>
.course-search {
  width: 450px;
  margin: 0 auto;

  .input-group {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
    border-radius: 3px;
    box-shadow:
      0 2px 2px 0 rgba(0,0,0,0.14),
      0 1px 5px 0 rgba(0,0,0,0.12),
      0 3px 1px -2px rgba(0,0,0,0.2);
    transition: width 0.3s ease;
  }

  .form-control {
    height: 45px;
    padding: 0 7px;
    font-size: 18px;
    text-indent: 10px;
    box-shadow: none;
  }

  .btn {
    padding: 8px 12px 4px;
    background-color: white;
    font-size: 22px;
    color: #656565;
    box-shadow: none;
    outline: none;

    &:hover {
      color: #444;
    }
  }
}
</style>
