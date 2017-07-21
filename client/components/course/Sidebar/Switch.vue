<template>
  <div class="switch control">
    <span class="title">{{ meta.label }}</span>
    <div class="control-group">
      <label
        :for="meta.key"
        :class="{ checked: value }">
        <input
          v-model="value"
          @change="$emit('update', meta.key, value)"
          :ref="meta.key"
          :id="meta.key"
          :name="meta.key"
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
  &:hover { background-color: #f5f5f5; };
}

.title {
  display: block;
  color: #808080;
  margin-bottom: 10px;
}

.control-group {
  margin: 5px 0 5px 0;
  line-height: 24px;
  word-wrap: break-word;
  font-weight: normal;
  color: #333;
}

.description {
  position: relative;
  top: 1px;
  margin-left: 46px;
  font-size: 17px;
}

.switch * {
  tap-highlight-color: transparent;
  user-select: none;
}

input[type=checkbox] {
  position: absolute;
  left: -9999px;
  opacity: 0;
}

label {
  position: relative;
  cursor: pointer;
  float: left;

  &.checked .lever {
    background: $lever-checked;
    &:after { background: $checked }
    &:before, &:after { left: 18px; }
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
  transition: background .3s ease;

  &:before, &:after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    left: 0;
    top: -3px;
    border-radius: 50%;
    transition:
      left .3s ease,
      background .3s ease,
      box-shadow .1s ease,
      transform .1s ease;
  }

  &:before {
    background-color: transparentize($checked, .85);
  }

  &:after {
    background-color: $unchecked;
    box-shadow:
      0 3px 1px -2px rgba(0,0,0,.2),
      0 2px 2px 0 rgba(0,0,0,.14),
      0 1px 5px 0 rgba(0,0,0,.12);
  }
}

.lever:active::before {
  transform: scale(2.4);
  background-color: rgba(0,0,0,.08);

  .checked & {
    transform: scale(2.4);
    background-color: transparentize($checked, .85);
  }
}

</style>
