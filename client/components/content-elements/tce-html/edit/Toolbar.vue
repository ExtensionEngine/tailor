<template>
  <div class="tce-html-toolbar">
    <div @mousedown.prevent="() => {}" id="quillToolbar">
      <span class="ql-formats">
        <button class="ql-undo" title="Undo" type="button"></button>
        <button class="ql-redo" title="Redo" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-font" title="Font"></select>
        <select class="ql-header" title="Style"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-bold" title="Bold" type="button"></button>
        <button class="ql-italic" title="Italic" type="button"></button>
        <button class="ql-underline" title="Underline" type="button"></button>
        <button class="ql-strike" title="Strikethrough" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-color" title="Text color"></select>
        <select class="ql-background" title="Highlight color"></select>
      </span>
      <span class="ql-formats">
        <button class="ql-script" value="sub" title="Subscript" type="button"></button>
        <button class="ql-script" value="super" title="Superscript" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-header" value="1" title="Heading 1" type="button"></button>
        <button class="ql-header" value="2" title="Heading 2" type="button"></button>
        <button class="ql-blockquote" title="Quote" type="button"></button>
        <button class="ql-code-block" title="Code" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-list" value="ordered" title="Numbered list" type="button"></button>
        <button class="ql-list" value="bullet" title="Bulleted List" type="button"></button>
        <button class="ql-indent" value="-1" title="Decrease indent" type="button"></button>
        <button class="ql-indent" value="+1" title="Increase indent" type="button"></button>
      </span>
      <span class="ql-formats">
        <select class="ql-align" title="Alignment">
          <option selected=""></option>
          <option value="center"></option>
          <option value="right"></option>
          <option value="justify"></option>
        </select>
        <button class="ql-direction" value="rtl" title="Text direction" type="button"></button>
      </span>
      <span class="ql-formats">
        <button class="ql-link" title="Insert link..." type="button"></button>
        <button class="ql-image" title="Image" type="button"></button>
        <!-- <button class="ql-video" type="button"></button> -->
        <!-- <button class="ql-formula" type="button"></button> -->
      </span>
      <span class="ql-formats">
        <button class="ql-clean" title="Clear formatting" type="button"></button>
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
  $color: #2a2a2a;
  $offset: 2px;
  $arrow-size: 5px;

  display: block;
  position: absolute;
  top: $offset !important;
  padding: 6px 12px;
  line-height: 1.42;
  background: $color;
  border: 1px solid #fff;
  border-radius: 0;
  z-index: 999;
  user-select: none;
  cursor: default;
  // TODO: Remove this after bootstrap gets removed!
  opacity: initial;

  .tooltip-arrow {
    position: absolute;
    width: 0;
    height: 0;
    border-color: $color;
    border-style: solid;
    margin: $arrow-size;
  }

  .tooltip-inner {
    padding: 0;
    color: #fff;
    font-size: 0.96rem;
    font-family: $font-family-secondary;
    font-weight: 500;
    text-align: center;
    // TODO: Remove this after bootstrap gets removed!
    background: initial;
  }

  &[x-placement^="bottom"] {
    margin-top: $arrow-size;
  }

  &[x-placement^="bottom"] .tooltip-arrow {
    top: -$arrow-size;
    left: calc(50% - #{$arrow-size});
    margin-top: 0;
    margin-bottom: 0;
    border-width: 0 $arrow-size $arrow-size $arrow-size;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
}
</style>
