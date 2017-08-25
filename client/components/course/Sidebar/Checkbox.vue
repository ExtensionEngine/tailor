<template>
  <div class="checkbox control">
    <span class="title">{{ meta.label }}</span>
    <div class="control-group">
      <label :for="meta.key" :class="{ checked: value }">
        <input
          v-model="value"
          :ref="meta.key"
          :id="meta.key"
          :name="meta.key"
          @change="$emit('update', meta.key, value)"
          type="checkbox">
      </label>
      <p class="description">{{ meta.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'checkbox-input',
  props: ['meta'],
  data() {
    return { value: this.meta.value };
  }
};
</script>

<style lang="scss" scoped>
$fill: #337ab7;
$border: #9c9c9c;

.control {
  padding: 3px 8px;

  &:hover {
    background-color: #f5f5f5;
  };
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}

.control-group {
  margin: 5px 0 5px 0;
  color: #333;
  font-weight: normal;
  line-height: 24px;
  word-wrap: break-word;
}

.description {
  margin-left: 30px;
  font-size: 17px;
}

input[type=checkbox] {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

label {
  display: inline-block;
  height: 24px;
  position: relative;
  float: left;
  line-height: 24px;
  cursor: pointer;
  user-select: none;
}

label:before, label:after {
  content: "";
  position: absolute;
  left: 0;
  z-index: 1;
  transition:
    width .20s .1s,
    height .20s .1s,
    top .20s .1s,
    left .20s .1s,
    background-color .25s,
    border .25s;
}

label:after {
  border-radius: 2px;
}

label:not(.checked) {
  &:before {
    width: 0;
    height: 0;
    left: 6px;
    top: 10px;
    border: 3px solid transparent;
    transform: rotateZ(37deg);
    transform-origin: 100% 100%;
  }

  &:after {
    height: 20px;
    width: 20px;
    top: 1px;
    background-color: transparent;
    border: 2px solid $border;
    z-index: 0;
  }
}

label.checked {
  &:before {
    width: 8px;
    height: 13px;
    top: 3px;
    left: 1px;
    border-top: 2px solid transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotateZ(37deg);
    backface-visibility: hidden;
    transform-origin: 100% 100%;
  }

  &:after {
    width: 20px;
    height: 20px;
    top: 1px;
    border: 2px solid $fill;
    background-color: $fill;
    z-index: 0;
  }
}
</style>
