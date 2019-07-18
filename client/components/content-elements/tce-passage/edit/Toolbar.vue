<template>
  <div id="joditToolbar" class="tce-passage-toolbar"></div>
</template>

<script>
import ToolbarBuilder from './ToolbarBuilder';

const buttons = ToolbarBuilder.build([[
  ['undo', 'Undo'],
  ['redo', 'Redo'],
  ['cut', 'Cut selection'],
  ['print', 'Print'],
  ['copyformat', 'Paint format']
], [
  ['font', 'Font'],
  ['fontsize', 'Font size'],
  ['paragraph', 'Style']
], [
  ['bold', 'Bold'],
  ['italic', 'Italic'],
  ['underline', 'Underline'],
  ['strikethrough', 'Strikethrough']
], [
  ['brush', 'Color']
], [
  ['subscript', 'Subscript'],
  ['superscript', 'Superscript']
], [
  ['ol', 'Numbered list'],
  ['ul', 'Bulleted list'],
  ['outdent', 'Decrease indent'],
  ['indent', 'Increase indent']
], [
  ['align', 'Alignment']
], [
  ['link', 'Insert link...'],
  ['table', 'Insert table'],
  ['image', 'Image'],
  ['symbol', 'Insert special character'],
  ['hr', 'Horizontal line']
], [
  ['eraser', 'Clear formatting']
]]);

export default {
  get $buttons() {
    return buttons;
  },
  computed: {
    buttons: () => buttons
  }
};
</script>

<style lang="scss">
@import '~jodit/build/jodit.min.css';

$icon-color: #333;
$icon-accent-color: #ff6590;
$icon-size: 18px;
$text-size: 16px;

.jodit_toolbar {
  margin: 0 !important;
  padding: 8px !important;
  font-family: $font-family-secondary;
  font-size: $text-size;
  line-height: $text-size;
  text-align: initial;
  background: transparent;
  border: none;
  box-shadow: none;

  & > li.jodit_toolbar_btn {
    min-width: 30px;

    & > a {
      padding: 6px 5px;
    }

    .jodit_icon {
      display: inline-block;
      width: $icon-size;
      height: $icon-size;
      color: $icon-color;
      font-size: $icon-size;
      line-height: $icon-size;
      vertical-align: top;

      &.stack {
        position: relative;
      }

      .stacked {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 100%;
        text-align: center;
      }
    }
  }

  &.loading > li.jodit_toolbar_btn {
    transition: none;
  }
}

.jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input) {
  @mixin colorize($color, $background: none) {
    color: $color;
    background: $background;

    & > a {
      color: inherit;
      background: inherit;

      .jodit_icon {
        color: inherit;
      }

      // dropdown chevrons
      .jodit_with_dropdownlist-trigger {
        border-top-color: $color;
      }
    }
  }

  &:not(.jodit_disabled):not(.popup_open) {
    &.jodit_active {
      @include colorize(
        $color: $icon-accent-color,
        $background: lighten($icon-accent-color, 25%)
      );
    }

    &:not(.jodit_active):hover {
      @include colorize($color: $icon-accent-color);
    }
  }

  &.popup_open, &.popup_open:hover {
    @include colorize($color: #c3c3c3);
  }

  &.jodit_toolbar_btn-separator {
    min-width: 0;
    margin-right: 15px !important;
    border: none;
  }

  .picker_label {
    display: inline-block;
    height: $icon-size;
    line-height: $icon-size;

    .jodit_icon {
      margin-right: 4px;
    }
  }

  // TODO: Remove after bootstrap gets removed!
  blockquote {
    border: none;
  }
}

.jodit_toolbar_list > .jodit_toolbar {
  &, & .jodit_toolbar {
    padding: 0 !important;
    background: #fff;
    border: 1px solid #ccc;
    box-shadow: rgba(0,0,0,0.2) 0 2px 8px;
  }

  li.jodit_toolbar_btn > a {
    padding: 8px 16px;

    .jodit_toolbar_btn-left & {
      padding: 8px 12px;
    }
  }
}

.jodit_colorpicker > div {
  margin-bottom: 8px;
}

.jodit_colorpicker .btn_reset_color {
  width: auto;

  &:active, &:hover {
    color: $icon-accent-color;
    background: none;
  }

  span {
    float: none;
  }

  & > span {
    display: inline-block;
    height: $icon-size;
    line-height: $icon-size;

    &:focus {
      outline: none;
    }

    span.jodit_icon {
      color: inherit;
    }
  }
}

.jodit_toolbar_btn .jodit_tooltip {
  $background-color: #2a2a2a;
  $text-color: #fff;
  $offset: -1px;
  $arrow-size: 5px;

  $horizontal-padding: 12px;

  display: block;
  position: absolute;
  z-index: 999;
  width: auto;
  min-width: 90px;
  margin-top: $arrow-size + $offset;
  padding: 6px $horizontal-padding;
  color: $text-color;
  font-size: 0.96rem;
  font-family: $font-family-secondary;
  font-weight: 500;
  text-align: center;
  line-height: 1.42;
  background: $background-color;
  border: 1px solid #fff;
  border-radius: 0;
  user-select: none;
  cursor: default;

  &::before {
    content: "";
    display: block;
    position: absolute;
    top: -$arrow-size;
    left: calc(50% - #{$arrow-size} - #{$horizontal-padding / 2});
    width: 0;
    height: 0;
    margin: 0 $arrow-size;
    border: $arrow-size solid transparent;
    border-top-width: 0;
    border-bottom-color: $background-color;
  }
}

.jodit_toolbar_btn.popup_open .jodit_tooltip {
  display: none;
}

.jodit_toolbar_popup {
  margin-top: 6px;
}
</style>
