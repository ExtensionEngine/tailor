<template>
  <div class="tce-html-toolbar">
    <div @mousedown.prevent="() => {}" id="quillToolbar">
      <span class="ql-formats">
        <button class="ql-undo" data-title="Undo" type="button"></button>
        <button class="ql-redo" data-title="Redo" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-font" data-title="Font"></select>
        <select class="ql-header" data-title="Style"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold" data-title="Bold" type="button"></button>
        <button class="ql-italic" data-title="Italic" type="button"></button>
        <button class="ql-underline" data-title="Underline" type="button"></button>
        <button class="ql-strike" data-title="Strikethrough" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color" data-title="Text color"></select>
        <select class="ql-background" data-title="Highlight color"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub" data-title="Subscript" type="button"></button>
        <button class="ql-script" value="super" data-title="Superscript" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1" data-title="Heading 1" type="button"></button>
        <button class="ql-header" value="2" data-title="Heading 2" type="button"></button>
        <button class="ql-blockquote" data-title="Quote" type="button"></button>
        <button class="ql-code-block" data-title="Code" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered" data-title="Numbered list" type="button"></button>
        <button class="ql-list" value="bullet" data-title="Bulleted List" type="button"></button>
        <button class="ql-indent" value="-1" data-title="Decrease indent" type="button"></button>
        <button class="ql-indent" value="+1" data-title="Increase indent" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align" data-title="Alignment">
          <option selected=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button class="ql-direction" value="rtl" data-title="Text direction" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link" data-title="Insert link..." type="button"></button>
        <button class="ql-image" data-title="Image" type="button"></button>
        <!-- <button class="ql-video" type="button"></button> -->
        <!-- <button class="ql-formula" type="button"></button> -->
      </span>
      <span class="ql-formats">
        <button class="ql-clean" data-title="Clear formatting" type="button"></button>
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
@import '@/assets/stylesheets/common/variables';

$icon-color: #333;
$icon-accent-color: #ff6590;
$icon-size: 1.125rem;

.tce-html-toolbar {
  display: flex;
  align-items: center;
  height: 4.5rem;
  padding: 0 0.5rem;
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

  @mixin colorize($color, $background: none) {
    color: $icon-accent-color;
    background: $background;

    .icon {
      color: inherit;
    }

    // dropdown chevrons
    .ql-stroke {
      stroke: currentColor;
    }

    .ql-fill {
      fill: currentColor;
    }
  }

  button:hover, button:focus {
    @include colorize($color: $icon-accent-color);
  }

  .ql-picker:not(.ql-expanded) .ql-picker-label:hover, .ql-picker-item:hover {
    @include colorize($color: $icon-accent-color);
  }

  button.ql-active, .ql-picker-label.ql-active {
    @include colorize(
      $color: $icon-accent-color,
      $background: lighten($icon-accent-color, 25%)
    );
  }

  .ql-picker-item.ql-selected {
    @include colorize($color: $icon-accent-color);
  }
}

.ql-toolbar .tooltip {
  $background-color: #2a2a2a;
  $text-color: #fff;
  $offset: 0.125rem;
  $arrow-size: 0.375rem;

  display: block;
  position: absolute;
  z-index: 999;
  margin-top: $arrow-size + $offset;
  padding: 0.375rem 0.75rem;
  line-height: 1.42;
  background: $background-color;
  border: 1px solid #fff;
  border-radius: 0;
  user-select: none;
  cursor: default;

  &-arrow {
    position: absolute;
    top: -$arrow-size;
    left: calc(50% - #{$arrow-size});
    width: 0;
    height: 0;
    margin: 0 $arrow-size;
    border: $arrow-size solid transparent;
    border-top-width: 0;
    border-bottom-color: $background-color;
  }

  &-inner {
    padding: 0;
    color: $text-color;
    font-size: 0.96rem;
    font-family: $font-family-secondary;
    font-weight: 500;
    text-align: center;
  }
}
</style>
