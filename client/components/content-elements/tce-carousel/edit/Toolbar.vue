<template>
  <div class="tce-carousel-toolbar">
    <ul>
      <li @click="add" class="btn btn-link btn-sm">
        <span class="mdi mdi-plus"></span>
        Add item
      </li>
      <li @click="remove" class="btn btn-link btn-sm">
        <span class="mdi mdi-minus"></span>
        Remove item
      </li>
      <li class="height">
        <label for="heightInput">
          <span class="mdi mdi-arrow-expand"></span>
          Height
        </label>
        <span
          :class="{ 'has-error': vErrors.has('height') }"
          class="form-group">
          <input
            v-model="height"
            v-validate="{ required: true, min_value: 300, max_value: 3000 }"
            id="heightInput"
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

export default {
  name: 'tce-carousel-toolbar',
  inject: ['$elementBus', '$validator'],
  props: {
    element: { type: Object, required: true }
  },
  data() {
    return {
      height: this.element.data.height || 500
    };
  },
  methods: {
    add() {
      this.$elementBus.emit('add');
    },
    remove() {
      this.$elementBus.emit('remove');
    }
  },
  watch: {
    height: debounce(function () {
      if (!this.vErrors.has('height')) {
        this.$elementBus.emit('height', this.height);
      }
    }, 2000)
  }
};
</script>

<style lang="scss" scoped>
.tce-carousel-toolbar {
  position: relative;
  width: 100%;
  height: 48px;

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
    margin: 0 0 0 10px;
    padding: 0;

    input {
      height: 25px;
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 14px;
    }

    label {
      padding: 0 10px;
      font-size: 12px;
      line-height: 12px;
      text-transform: uppercase;
    }

    .form-group {
      margin: 0;
      padding: 0;
    }
  }
}
</style>
