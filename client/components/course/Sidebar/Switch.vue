<template>
  <div class="switch control">
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
        <span class="lever"></span>
      </label>
    </div>
    <p class="description">{{ meta.description }}</p>
  </div>
</template>

<script>
export default {
  name: 'switch-input',
  props: ['meta'],
  data() {
    return { value: this.meta.value };
  }
};
</script>

<style lang="scss" scoped>
$size: 15px;
$checked: #337ab7;
$unchecked: #949494;
$lever-checked: lighten($checked, 25%);
$lever-unchecked: lighten($unchecked, 25%);

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
  position: relative;
  top: 1px;
  margin-left: 46px;
  font-size: 17px;
}

.switch * {
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

input[type=checkbox] {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

label {
  position: relative;
  float: left;
  cursor: pointer;

  &.checked .lever {
    background: $lever-checked;

    &::after {
      background: $checked;
    }

    &::before, &::after {
      left: 18px;
    }
  }
}

.lever {
  content: "";
  display: inline-block;
  position: relative;
  width: 36px;
  height: 14px;
  vertical-align: middle;
  background-color: $lever-unchecked;
  border-radius: $size;
  transition: background 0.3s ease;

  &::before, &::after {
    content: "";
    display: inline-block;
    position: absolute;
    top: -3px;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    transition:
      left 0.3s ease,
      background 0.3s ease,
      box-shadow 0.1s ease,
      transform 0.1s ease;
  }

  &::before {
    background-color: transparentize($checked, 0.85);
  }

  &::after {
    background-color: $unchecked;
    box-shadow:
      0 3px 1px -2px rgba(0,0,0,0.2),
      0 2px 2px 0 rgba(0,0,0,0.14),
      0 1px 5px 0 rgba(0,0,0,0.12);
  }
}

.lever:active::before {
  transform: scale(2.4);
  background-color: rgba(0,0,0,0.08);

  .checked & {
    transform: scale(2.4);
    background-color: transparentize($checked, 0.85);
  }
}
</style>
