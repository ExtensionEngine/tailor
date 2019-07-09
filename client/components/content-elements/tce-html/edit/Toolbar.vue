<template>
  <div class="tce-html-toolbar">
    <div @mousedown.prevent="() => {}" id="quillToolbar">
      <span class="ql-formats">
        <button class="ql-undo" type="button"></button>
        <button class="ql-redo" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-font"></select>
        <select class="ql-header"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold" type="button"></button>
        <button class="ql-italic" type="button"></button>
        <button class="ql-underline" type="button"></button>
        <button class="ql-strike" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color"></select>
        <select class="ql-background"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub" type="button"></button>
        <button class="ql-script" value="super" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1" type="button"></button>
        <button class="ql-header" value="2" type="button"></button>
        <button class="ql-blockquote" type="button"></button>
        <button class="ql-code-block" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered" type="button"></button>
        <button class="ql-list" value="bullet" type="button"></button>
        <button class="ql-indent" value="-1" type="button"></button>
        <button class="ql-indent" value="+1" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align">
          <option selected=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button class="ql-direction" value="rtl" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link" type="button"></button>
        <button class="ql-image" type="button"></button>
        <!-- <button class="ql-video" type="button"></button> -->
        <!-- <button class="ql-formula" type="button"></button> -->
      </span>
      <span class="ql-formats">
        <button class="ql-clean" type="button"></button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tce-html-toolbar'
};
</script>

<style lang="scss">
$icon-color: #333;
$icon-accent-color: #ff6590;
$icon-size: 18px;

.tce-html-toolbar {
  display: flex;
  align-items: center;
  height: 45px;
  text-align: initial;
}

.ql-toolbar .icon {
  width: $icon-size;
  height: $icon-size;
  color: $icon-color;
  font-size: $icon-size;
  line-height: $icon-size;
  vertical-align: top;
}

.ql-toolbar .ql-direction {
  span:last-child {
    display: none;
  }

  &.ql-active {
    span:last-child {
      display: initial;
    }

    span:first-child {
      display: none;
    }
  }
}

.ql-toolbar.ql-snow {
  border: none;

  @mixin icon-color($color, $background: none) {
    background: $background;

    .icon {
      color: $icon-accent-color;
    }
  }

  button:hover, button:focus, .ql-picker-label:hover, .ql-picker-item:hover {
    @include icon-color($color: $icon-accent-color);
  }

  button.ql-active, .ql-picker-label.ql-active, .ql-picker-item.ql-selected {
    @include icon-color(
      $color: $icon-accent-color,
      $background: lighten($icon-accent-color, 25%)
    );
  }
}
</style>
