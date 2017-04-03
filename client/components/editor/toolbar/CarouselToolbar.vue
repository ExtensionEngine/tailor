<template>
  <div class="carousel-toolbar">
    <ul>
      <li @click="add" class="btn btn-link btn-sm">
        <span class="mdi mdi-plus"></span> Add item
      </li>
      <li class="height">
        <span class="form-group" :class="{ 'has-error': vErrors.has('height') }">
          <input
            v-model="height"
            v-validate="{ rules: { required: true, min_value: 300, max_value: 3000 } }"
            class="form-control"
            name="height"
            type="text"
            placeholder="Height">
        </span>
        <span v-show="vErrors.has('height')" class="help-block">
          {{ vErrors.first('height') }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import EventBus from 'EventBus';

const teChannel = EventBus.channel('te');

export default {
  name: 'carousel-toolbar',
  props: ['element'],
  data() {
    return {
      height: this.element.data.height || 500
    };
  },
  methods: {
    add() {
      if (!this.vErrors.has('height')) {
        teChannel.emit(`${this.element._cid}/add`, this.height);
      }
    }
  },
  watch: {
    height: debounce(function (newHeight) {
      if (!this.vErrors.has('height')) {
        teChannel.emit(`${this.element._cid}/height`, this.height);
      }
    }, 2000)
  }
};
</script>

<style lang="scss" scoped>
.carousel-toolbar {
  position: relative;
  width: 100%;
  height: 48px;
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

      .form-group {
        display: inline-block;
      }

      .help-block {
        display: inline-block;
        padding-left: 10px;
      }

      .mdi {
        display: inline-block;
        margin-right: 5px;
        font-size: 20px;
        line-height: 20px;
        vertical-align: middle;
      }

      &.active {
        background-color: #e8e8e8;
      }
    }
  }

  .height {
    display: inline-block;
    margin-bottom: 0;
    padding: 6px 12px;
    text-align: center;
    vertical-align: middle;
  }
}
</style>
