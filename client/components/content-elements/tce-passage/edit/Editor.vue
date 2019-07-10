<template>
  <div class="jodit-wrapper">
    <jodit-vue
      ref="jodit"
      v-bind="{ id, config, value }"
      @input="value => $emit('input', value)"/>
  </div>
</template>

<script>
import cuid from 'cuid';
// TODO: Import `Jodit` from `jodit-vue` once it becomes available!
import Jodit from 'jodit';
import JoditVue from 'jodit-vue';
import mdiIcons from './plugins/mdi-icons';

// Load custom plugins.
Object.assign(Jodit.plugins, { mdiIcons });

const JODIT_TOOLBAR_BREAK = '\n';

const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

/** @type {import('jodit/src/Config').Config & import('jodit/src/plugins') } */
const joditConfig = {
  autofocus: true,
  addNewLineOnDBLClick: false,
  showTooltipDelay: 350,
  // Disable fullsize plugin & remove it's toolbar item.
  disablePlugins: ['fullsize'],
  removeButtons: ['fullsize', 'about', JODIT_TOOLBAR_BREAK],
  // Disable default toolbar.
  toolbar: false,
  // Setup Ace editor.
  sourceEditorNativeOptions: {
    theme: 'ace/theme/chrome'
  }
};

export default {
  props: {
    value: { type: String, required: true },
    minHeight: { type: Number, required: true },
    placeholder: { type: String, default: 'Insert text here...' }
  },
  computed: {
    id: () => cuid(),
    config: vm => ({
      ...joditConfig,
      minHeight: vm.minHeight,
      placeholder: vm.placeholder
    })
  },
  mounted() {
    const toolbarContainer = document.getElementById('joditToolbar');
    renderToolbar(this.$refs.jodit.editor, toolbarContainer);
  },
  components: {
    JoditVue
  }
};

function renderToolbar(jodit, toolbarContainer) {
  const { options } = jodit;
  const buttons = splitArray(options.buttons).concat(options.extraButtons);
  return jodit.toolbar.build(buttons, toolbarContainer);
}
</script>

<style lang="scss" scoped>
$statusbar-height: 26px;
$statusbar-border-size: 1px;

.jodit-wrapper /deep/ .jodit_placeholder {
  font-style: italic;
}

.jodit-wrapper /deep/ .jodit_statusbar {
  height: $statusbar-height;
  line-height: $statusbar-height - $statusbar-border-size;

  .jodit_statusbar_item {
    line-height: inherit;
  }

  .jodit_toolbar_btn {
    line-height: inherit;
    vertical-align: top;

    a {
      vertical-align: middle;
    }
  }
}

.jodit-wrapper /deep/ .jodit_source .ace_editor {
  font-size: 13px;
  font-family: $font-family-monospace;
}
</style>

<style lang="scss">
@import '~jodit/build/jodit.min.css';

$icon-color: #333;
$icon-accent-color: #ff6590;
$icon-size: 18px;

.jodit_toolbar_btn .jodit_icon {
  display: inherit;
  width: $icon-size;
  height: $icon-size;
  color: $icon-color;
  font-size: $icon-size;
}

.jodit_statusbar .jodit_toolbar_btn .jodit_icon {
  line-height: $icon-size;
}

.jodit_toolbar > .jodit_toolbar_btn:not(.jodit_toolbar-input) {
  &.jodit_toolbar_btn-separator {
    margin-right: 15px !important;
    border: none;
  }

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

      // TODO: Remove after bootstrap gets removed!
      blockquote {
        border: none;
      }
    }
  }

  &:not(.jodit_disabled) {
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
}

.jodit_toolbar_list > .jodit_toolbar, .jodit_toolbar_list > .jodit_toolbar .jodit_toolbar {
  background: #fff;
  border: 1px solid #ccc;
  box-shadow: rgba(0,0,0,0.2) 0 2px 8px;
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
</style>
