<template>
  <div class="checkbox">
    <span class="title">{{ meta.label }}</span>
    <div class="control-group">
      <label
        :for="meta.key"
        :class="{ checked: value }">
        <input
          v-model="value"
          :ref="meta.key"
          :id="meta.key"
          :name="meta.key"
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
$border: #9c9c9c;
$fill: #337ab7;

.checkbox {
  padding: 3px 8px;
  &:hover { background-color: #f5f5f5; };
}

.title {
  display: block;
  color: #808080;
  margin-bottom: 10px;
}

.control-group {
  margin: 5px 0px 5px 0;
  line-height: 24px;
  word-wrap: break-word;
  font-weight: normal;
  color: #333;
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
  position: relative;
  height: 24px;
  line-height: 24px;
  float: left;
  cursor: pointer;
  user-select: none;
}

label:before,
label:after {
  content: "";
  left: 0;
  position: absolute;
  transition:
    width .20s .1s,
    height .20s .1s,
    top .20s .1s,
    left .20s .1s,
    background-color .25s,
    border .25s;
  z-index: 1;
}

label:after { border-radius: 2px; }

label:not(.checked) {
  &:before {
    width: 0;
    height: 0;
    border: 3px solid transparent;
    left: 6px;
    top: 10px;
    transform: rotateZ(37deg);
    transform-origin: 100% 100%;
  }

  &:after {
    height: 20px;
    width: 20px;
    background-color: transparent;
    border: 2px solid $border;
    top: 1px;
    z-index: 0;
  }
}

label.checked {
  &:before {
    top: 3px;
    left: 1px;
    width: 8px;
    height: 13px;
    border-top: 2px solid transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    transform: rotateZ(37deg);
    backface-visibility: hidden;
    transform-origin: 100% 100%;
  }

  &:after {
    top: 1px;
    width: 20px;
    height: 20px;
    border: 2px solid $fill;
    background-color: $fill;
    z-index: 0;
  }
}

</style>
