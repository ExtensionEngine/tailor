<template>
  <div class="jodit-wrapper">
    <jodit-vue
      ref="jodit"
      v-bind="{ id, buttons, config, value }"
      @input="value => $emit('input', value)"/>
  </div>
</template>

<script>
import fontControls from './plugins/font-controls';
// TODO: Import `Jodit` from `jodit-vue` once it becomes available!
import Jodit from 'jodit';
import JoditVue from 'jodit-vue';
import mdiIcons from './plugins/mdi-icons';
import Toolbar from './Toolbar';
import toolbarPopups from './plugins/toolbar-popups';
import uniqueId from 'lodash/uniqueId';

const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

/** @type {import('jodit/src/Config').Config & import('jodit/src/plugins') } */
const joditConfig = {
  addNewLineOnDBLClick: false,
  showTooltipDelay: 350,
  colorPickerDefaultTab: 'color',
  disablePlugins: ['fullsize', 'source'],
  toolbar: false
};

// Load custom plugins.
mdiIcons(Jodit, {
  btnResetColorClass: 'btn_reset_color'
});
fontControls(Jodit, {
  pickerLabelClass: 'picker_label'
});
toolbarPopups(Jodit, {
  popupOpenClass: 'popup_open'
});

export default {
  props: {
    value: { type: String, required: true },
    minHeight: { type: Number, required: true },
    placeholder: { type: String, default: 'Insert text here...' }
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
  mounted() {
    const { editor } = this.$refs.jodit;
    editor.selection.focus();
    const toolbarContainer = document.getElementById('joditToolbar');
    renderToolbar(editor, toolbarContainer);
  },
  components: {
    JoditVue
  }
};

function renderToolbar(jodit, toolbarContainer) {
  const { options, toolbar } = jodit;
  const buttons = splitArray(options.buttons).concat(options.extraButtons);
  toolbar.container.classList.add('loading');
  const result = toolbar.build(buttons, toolbarContainer);
  setTimeout(() => toolbar.container.classList.remove('loading'), 0);
  return result;
}
</script>

<style lang="scss" scoped>
$icon-color: #333;
$icon-size: 18px;
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
</style>
