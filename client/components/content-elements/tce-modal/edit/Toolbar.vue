<template>
  <div class="tce-modal-toolbar">
    <ul>
      <li @click="toggleEdit" class="btn btn-link btn-sm">
        <span class="mdi mdi-pencil"></span>
        <span>Toggle Edit</span>
      </li>
      <li class="title form-inline">
        <label for="titleInput">Title</label>
        <input
          v-model="title"
          id="titleInput"
          class="form-control"
          type="text"
          placeholder="Title">
      </li>
    </ul>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';

export default {
  inject: ['$elementBus'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      title: this.element.data.title
    };
  },
  methods: {
    toggleEdit() {
      this.$elementBus.emit('toggleEdit');
    }
  },
  watch: {
    title: debounce(function () {
      const data = cloneDeep(this.element.data);
      data.title = this.title;
      this.$elementBus.emit('save', data);
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
.tce-modal-toolbar {
  position: relative;
  width: 100%;
  height: 50px;

  ul {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      color: #444;

      &.btn {
        padding-top: 15px;
      }

      .mdi {
        display: inline-block;
        margin-right: 5px;
        font-size: 18px;
        line-height: 18px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }
  }
}

.title {
  display: inline-block;
  margin: 0 0 0 10px;
  padding: 0;
  font-size: 14px !important;

  input {
    min-width: 250px;
    height: 20px;
    font-size: 14px;
    line-height: 14px;
  }

  label {
    padding: 2px 10px;
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
  }
}
</style>
