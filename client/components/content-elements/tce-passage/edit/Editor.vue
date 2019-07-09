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
  // Disable fullsize plugin & remove it's toolbar item.
  disablePlugins: ['fullsize'],
  removeButtons: ['fullsize', 'about', JODIT_TOOLBAR_BREAK],
  // Disable default toolbar.
  toolbar: false,
  // Setup Ace editor.
  sourceEditorNativeOptions: {
    theme: 'ace/theme/chrome'
  },
  autofocus: true
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

.jodit_toolbar > li.jodit_toolbar_btn {
  &.jodit_toolbar_btn-separator {
    margin-right: 15px !important;
    border: none;
  }

  &.jodit_active {
    background: lighten($icon-accent-color, 25%);

    .jodit_icon {
      color: $icon-accent-color;
    }
  }

  &:not(.jodit_toolbar-input):hover {
    background: none;

    .jodit_icon {
      color: $icon-accent-color;
    }
  }
}
</style>
