<template>
  <div class="jodit_wrapper">
    <jodit-vue
      ref="jodit"
      @input="value => $emit('input', value)"
      v-bind="{ id, buttons, config, value }" />
  </div>
</template>

<script>
import JoditVue, { Jodit } from 'jodit-vue';
import externalToolbar from './plugins/external-toolbar';
import fontControls from './plugins/font-controls';
import mdiIcons from './plugins/mdi-icons';
import pluginsAdapter from './plugins-adapter';
import sourceEditor from './plugins/source-editor';
import tablePopups from './plugins/table-popups';
import Toolbar from './Toolbar';
import toolbarPopups from './plugins/toolbar-popups';
import uniqueId from 'lodash/uniqueId';

const JODIT_READY_EVENT = 'joditReady';

/** @type {import('jodit/src/Config').Config & import('jodit/src/plugins') } */
const joditConfig = {
  autofocus: true,
  addNewLineOnDBLClick: false,
  showTooltipDelay: 350,
  colorPickerDefaultTab: 'color',
  disablePlugins: ['fullsize']
};

pluginsAdapter(Jodit);

// Load custom plugins.
externalToolbar(Jodit, {
  readyEvent: JODIT_READY_EVENT,
  toolbarContainer: '#joditToolbar'
});
mdiIcons(Jodit, {
  btnResetColorClass: 'btn_reset_color'
});
fontControls(Jodit, {
  pickerLabelClass: 'picker_label'
});
toolbarPopups(Jodit, {
  popupOpenClass: 'popup_open'
});
sourceEditor(Jodit);
tablePopups(Jodit);

export default {
  props: {
    value: { type: String, required: true },
    minHeight: { type: Number, required: true },
    placeholder: { type: String, default: 'Insert text here...' },
    readonly: { type: Boolean, default: false }
  },
  computed: {
    id: () => uniqueId('jodit_editor_'),
    buttons: () => Toolbar.$buttons,
    config: vm => ({
      ...joditConfig,
      minHeight: vm.minHeight,
      placeholder: vm.placeholder
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
  mounted() {
    const { editor } = this.$refs.jodit;
    editor.editor.style.cursor = 'initial';
    editor.events
      .on('afterInit', afterInit)
      .on('beforeDestruct', () => {
        if (editor.events) editor.events.off('afterInit', afterInit);
      });

    function afterInit() {
      setTimeout(() => {
        editor.selection.focus();
        editor.events.fire(JODIT_READY_EVENT);
      }, 0);
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
