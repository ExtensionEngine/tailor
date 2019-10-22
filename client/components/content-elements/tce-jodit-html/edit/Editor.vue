<template>
  <div class="jodit_wrapper">
    <jodit-vue
      ref="jodit"
      @input="value => $emit('input', value)"
      v-bind="{ id, config, value }" />
    <jodit-vue
      ref="jodit"
      @input="value => $emit('input', value)"
      v-bind="{ id, config: { ...config, plugins: [] }, value }" />
  </div>
</template>

<script>
import JoditVue, { Jodit } from 'jodit-vue';
import AutofocusPlugin from './plugins/autofocus';
import ExternalToolbarPlugin from './plugins/external-toolbar';
import FontControlsPlugin from './plugins/font-controls';
import MdiIconsPlugin from './plugins/mdi-icons';
import pluginsAdapter from './plugins-adapter';
import SourceEditorPlugin from './plugins/source-editor';
import TablePopupsPlugin from './plugins/table-popups';
import Toolbar from './Toolbar';
import ToolbarBuilderPlugin from './plugins/toolbar-builder';
import ToolbarPopupsPlugin from './plugins/toolbar-popups';
import TooltipPlugin from './plugins/tooltip';
import uniqueId from 'lodash/uniqueId';

const JODIT_READY_EVENT = 'joditReady';
const JODIT_TOOLBAR_SEPARATOR = '|';

/** @type {import('jodit/src/Config').Config & import('jodit/src/plugins')} */
const joditConfig = {
  autofocus: true,
  addNewLineOnDBLClick: false,
  showTooltipDelay: 350,
  colorPickerDefaultTab: 'color',
  disablePlugins: ['fullsize'],
  language: 'en'
};

pluginsAdapter(Jodit);

const plugins = [{
  use: TooltipPlugin
}, {
  use: ToolbarBuilderPlugin,
  options: {
    buttons: Toolbar.$buttons,
    separator: JODIT_TOOLBAR_SEPARATOR
  }
}, {
  use: ExternalToolbarPlugin,
  options: {
    readyEvent: JODIT_READY_EVENT,
    toolbarContainer: Toolbar.$containerId
  }
}, {
  use: FontControlsPlugin,
  options: {
    pickerLabelClass: 'picker_label'
  }
}, {
  use: MdiIconsPlugin,
  options: {
    btnResetColorClass: 'btn_reset_color'
  }
}, {
  use: ToolbarPopupsPlugin,
  options: {
    popupOpenClass: 'popup_open'
  }
}, {
  use: SourceEditorPlugin
}, {
  use: TablePopupsPlugin
}, {
  use: AutofocusPlugin,
  options: {
    readyEvent: JODIT_READY_EVENT
  }
}];

export default {
  props: {
    value: { type: String, required: true },
    minHeight: { type: Number, required: true },
    placeholder: { type: String, default: 'Insert text here...' },
    readonly: { type: Boolean, default: false }
  },
  computed: {
    id: () => uniqueId('jodit_editor_'),
    config: vm => ({
      ...joditConfig,
      minHeight: vm.minHeight,
      placeholder: vm.placeholder,
      plugins
    })
  },
  watch: {
    readonly(state) {
      const { editor } = this.$refs.jodit;
      if (!editor) return;
      editor.setReadOnly(state);
      if (!state) editor.selection.focus();
    }
  },
  components: {
    JoditVue
  }
};
</script>

<style lang="scss" scoped>
$icon-color: #333;
$icon-size: 18px;
$statusbar-height: 26px;
$statusbar-border-size: 1px;
$min-height: 140px;

.jodit_wrapper /deep/ {
  .jodit_container:not(.jodit_inline) {
    min-height: $min-height;

    .jodit_workplace {
      border: none;
    }
  }

  .jodit_placeholder {
    font-style: italic;
  }

  .jodit_source .ace_editor {
    font-size: 13px;
    font-family: $font-family-monospace;
  }

  .jodit_statusbar {
    height: $statusbar-height;
    line-height: $statusbar-height - $statusbar-border-size;
    background-color: transparent;
    border: none;

    .jodit_statusbar_item {
      line-height: inherit;
    }

    .jodit_toolbar_btn {
      line-height: inherit;
      vertical-align: top;

      & > a {
        vertical-align: middle;
      }

      .jodit_icon {
        display: inline-block;
        width: $icon-size;
        height: $icon-size;
        color: $icon-color;
        font-size: $icon-size;
        line-height: $icon-size;
      }
    }
  }
}
</style>
