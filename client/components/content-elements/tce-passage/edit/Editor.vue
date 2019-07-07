<template>
  <div class="jodit-wrapper">
    <jodit-vue
      ref="jodit"
      v-bind="{ id, config, value }"
      @input="value => $emit('input', value)"/>
  </div>
</template>

<script>
import mdiToolbarIcons, { JODIT_TOOLBAR_BREAK } from './toolbar-icons';
import cuid from 'cuid';
import JoditVue from 'jodit-vue';

const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

/** @type {import('jodit/src/Config').Config & import('jodit/src/plugins') } */
const joditConfig = {
  // Disable fullsize plugin & remove it's toolbar item.
  disablePlugins: ['fullsize'],
  removeButtons: ['fullsize', 'about', JODIT_TOOLBAR_BREAK],
  // Disable default toolbar.
  toolbar: false,
  events: { getIcon: getMdiIcon },
  // Setup Ace editor.
  sourceEditorNativeOptions: {
    theme: 'ace/theme/chrome'
  },
  autofocus: true
};

export default {
  props: {
    value: { type: String, required: true }
  },
  computed: {
    id: () => cuid(),
    config: () => joditConfig
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

function getMdiIcon(name) {
  const code = mdiToolbarIcons[name];
  return `<span class="mdi mdi-${code}"></span>`;
}
</script>

<style lang="scss" scoped>
$statusbar-height: 26px;
$statusbar-border-size: 1px;

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
</style>
