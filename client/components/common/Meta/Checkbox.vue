<template>
  <div class="checkbox control">
    <span class="title">{{ meta.label }}</span>
    <div class="control-group">
      <label :for="meta.key" :class="{ checked: value }">
        <input
          :ref="meta.key"
          v-model="value"
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
  props: {
    meta: { type: Object, default: () => ({ value: null }) }
  },
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
  }
}

.title {
  display: block;
  margin-bottom: 10px;
  color: #808080;
}

.control-group {
  margin: 5px 0;
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
  position: relative;
  float: left;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  user-select: none;
}

label::before, label::after {
  content: "";
  position: absolute;
  left: 0;
  z-index: 1;
  transition:
    width 0.2s 0.1s,
    height 0.2s 0.1s,
    top 0.2s 0.1s,
    left 0.2s 0.1s,
    background-color 0.25s,
    border 0.25s;
}

label::after {
  border-radius: 2px;
}

label:not(.checked) {
  &::before {
    top: 10px;
    left: 6px;
    transform: rotateZ(37deg);
    width: 0;
    height: 0;
    border: 3px solid transparent;
    transform-origin: 100% 100%;
  }

  &::after {
    top: 1px;
    width: 20px;
    height: 20px;
    background-color: transparent;
    border: 2px solid $border;
    z-index: 0;
  }
}

label.checked {
  &::before {
    top: 3px;
    left: 1px;
    transform: rotateZ(37deg);
    width: 8px;
    height: 13px;
    border-top: 2px solid transparent;
    border-left: 2px solid transparent;
    border-right: 2px solid #fff;
    border-bottom: 2px solid #fff;
    backface-visibility: hidden;
    transform-origin: 100% 100%;
  }

  &::after {
    top: 1px;
    width: 20px;
    height: 20px;
    background-color: $fill;
    border: 2px solid $fill;
    z-index: 0;
  }
}
</style>
