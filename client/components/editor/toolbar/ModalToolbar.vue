<template>
  <div class="modal-toolbar">
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
import EventBus from 'EventBus';
import { mapActions } from 'vuex-module';

const teChannel = EventBus.channel('te');

export default {
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      title: this.element.data.title
    };
  },
  computed: {
    id() {
      return this.element._cid || this.element.id;
    }
  },
  methods: {
    ...mapActions(['save'], 'tes'),
    toggleEdit() {
      teChannel.emit(`${this.id}/toggleEdit`);
    }
  },
  watch: {
    title: debounce(function () {
      let element = cloneDeep(this.element);
      element.data.title = this.title;
      this.save(element);
    }, 500)
  }
};
</script>

<style lang="scss" scoped>
.modal-toolbar {
  position: relative;
  width: 100%;
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.34);

  ul {
    float: left;
    height: 100%;
    margin: 0;
    padding: 0 30px 0 10px;

    li {
      height: 100%;
      padding-top: 15px;
      color: #444;

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
    font-family: 'Catamaran', Helvetica, Arial, sans-serif;
    text-transform: uppercase;
  }
}
</style>
