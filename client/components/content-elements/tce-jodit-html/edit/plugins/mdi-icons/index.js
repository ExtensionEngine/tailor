import autoBind from 'auto-bind';
import { getMdiIcon } from './toolbar-icons';

const CSS_NO_COLOR = '';
const JODIT_COLORPICKER = '.jodit_colorpicker';
const JODIT_COMMAND_BACKGROUND_COLOR = 'background';
const JODIT_COMMAND_TEXT_COLOR = 'forecolor';
const JODIT_CONTROL_ALIGN = 'align';
const JODIT_CONTROL_COLOR = 'brush';
const JODIT_DEFAULT_EVENT_NAMESPACE = 'JoditEventDefaultNamespace';
const JODIT_PICKER_SELECTION_EVENTS = ['mousedown', 'touchend'];

const noop = () => {};

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */
/** @typedef {import('jodit').IToolbarButton} Button */
/** @typedef {import('jodit').IControlType<Jodit,Button} Control */
/** @typedef {import('jodit').IEventsNative} Events */

/**
 * @typedef {Object} ColorPickers
 * @property {HTMLElement} textColor
 * @property {HTMLElement} backgroundColor
 * @property {HTMLElement} [borderColor]
 */

export default class MdiIconsPlugin {
  static get pluginName() {
    return 'mdi-icons';
  }

  constructor(options) {
    options.btnResetColorClass = options.btnResetColorClass || 'btn_reset_color';
    options.selectedMarkerClass = options.selectedMarkerClass || 'selected_color_marker';
    autoBind(this);
  }

  /**
   * @param {HTMLElement} el
   * @returns {boolean}
   */
  isResetButton(el) {
    return el.classList.contains(this.options.btnResetColorClass);
  }

  /**
  * @param {Config} config
  */
  apply({ controls, popup }) {
    const self = this;
    let control;

    if ((control = controls[JODIT_CONTROL_ALIGN])) {
      const { getLabel = noop } = control;
      control.getLabel = function () {
        const result = getLabel.apply(this, arguments);
        self.getAlignmentLabel(...arguments);
        return result;
      };
    }

    if ((control = controls[JODIT_CONTROL_COLOR])) {
      const { getLabel = noop } = control;
      control.getLabel = function () {
        const result = getLabel.apply(this, arguments);
        self.getColorLabel(...arguments);
        return result;
      };

      const { popup: createPopup = noop } = control;
      control.popup = function () {
        const popup = createPopup.apply(this, arguments);
        if (!popup) return popup;
        return self.colorPopup(popup, ...arguments);
      };
    }

    if (Array.isArray(popup.table)) {
      control = popup.table.find(it => it.name === JODIT_CONTROL_COLOR);
      if (control) {
        const { popup: createPopup = noop } = control;
        control.popup = function () {
          const popup = createPopup.apply(this, arguments);
          if (!popup) return popup;
          return self.inlineColorPopup(popup, ...arguments);
        };
      }
    }
  }

  /**
  * @param {Jodit} jodit
  * @param {Control} control
  * @param {Button} button
  */
  getAlignmentLabel(jodit, control, button) {
    // Show current alignment inside button label.
    const currentValue = control.data && control.data.currentValue;
    if (!currentValue) return;
    button.textBox.innerHTML = '';
    button.textBox.appendChild(button.createIcon(currentValue, control));
  }

  /**
  * @param {Jodit} jodit
  * @param {Control} control
  * @param {Button} button
  */
  getColorLabel(jodit, control, button) {
    // Colorize material design `color-helper` icon.
    const colorHelper = button.textBox.querySelector('.mdi-color-helper');
    const svg = button.textBox.querySelector('svg');
    if (!colorHelper || !svg) return;
    colorHelper.style.color = svg.style.fill;
  }

  /**
   * @param {HTMLElement} popup
   * @param {Jodit} jodit
   * @param {Node} current
   * @param {Control} control
   * @param {Function} close
   */
  colorPopup(popup, jodit, current, control, close = noop) {
    const { events, options } = jodit;
    const pickers = getColorPickers(popup, { defaultTab: options.colorPickerDefaultTab });

    // Add reset color buttons to main toolbar's colorpicker/s.
    onSelect(events, this.addResetButton(pickers.textColor), () => {
      jodit.execCommand(JODIT_COMMAND_TEXT_COLOR, false, CSS_NO_COLOR);
      close();
    });
    onSelect(events, this.addResetButton(pickers.backgroundColor), () => {
      jodit.execCommand(JODIT_COMMAND_BACKGROUND_COLOR, false, CSS_NO_COLOR);
      close();
    });

    return popup;
  }

  /**
  * @param {HTMLElement} popup
  * @param {Jodit} jodit
  * @param {HTMLTableElement} table
  */
  inlineColorPopup(popup, jodit, table) {
    const self = this;
    const { constructor: Jodit, events } = jodit;
    const pickers = getColorPickers(popup, { defaultTab: 'background' });

    pickers.forEach(picker => {
      const selected = picker.querySelector('.active');
      if (selected) this.changeSelectedMarker(selected);

      const [eventDesc] = events.getStore(picker)
        .get(JODIT_PICKER_SELECTION_EVENTS[0], JODIT_DEFAULT_EVENT_NAMESPACE);
      const oldListener = eventDesc && eventDesc.originalCallback;
      if (!oldListener) return;

      replaceListener(
        jodit,
        picker,
        JODIT_PICKER_SELECTION_EVENTS.join(' '),
        newListener,
        oldListener
      );

      function newListener(e) {
        oldListener.apply(this, arguments);
        self.onColorChange(e, picker);
      }
    });

    // Add reset color buttons to inline toolbar's colorpicker/s.
    onSelect(events, this.addResetButton(pickers.textColor), () => {
      const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
      selectedCells.forEach(cell => (cell.style.color = CSS_NO_COLOR));
      jodit.setEditorValue();
    });
    onSelect(events, this.addResetButton(pickers.backgroundColor), () => {
      const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
      selectedCells.forEach(cell => (cell.style.backgroundColor = CSS_NO_COLOR));
      jodit.setEditorValue();
    });
    onSelect(events, this.addResetButton(pickers.borderColor), () => {
      const selectedCells = Jodit.modules.Table.getAllSelectedCells(table);
      selectedCells.forEach(cell => (cell.style.borderColor = CSS_NO_COLOR));
      jodit.setEditorValue();
    });

    return popup;
  }

  /**
   * @param {Event} e
   * @param {HTMLElement} picker
   */
  onColorChange(e, picker) {
    const { constructor: Jodit } = this.jodit;

    const button = Jodit.modules.Dom.up(e.target, el => el.matches('[data-color]'), picker);
    if (!button) return;

    const selected = picker.querySelector('.active');
    if (!selected) return;

    if (this.isResetButton(button)) {
      selected.classList.remove('active');
      selected.innerHTML = '';
      return;
    }

    this.changeSelectedMarker(selected);
  }

  /**
   * @param {HTMLElement} picker
   * @return {HTMLSpanElement}
   */
  addResetButton(picker) {
    const btnResetColor = picker &&
      Array.from(picker.children).filter(el => el.matches('a')).pop();
    if (!btnResetColor) return document.createElement('span');
    btnResetColor.classList.add(this.options.btnResetColorClass);
    btnResetColor.innerHTML = '';
    const tabIndex = this.jodit.options.allowTabNavigation ? 0 : -1;
    btnResetColor
      .appendChild(createButton({ icon: 'mdi-water-off', text: 'None', tabIndex }));
    return btnResetColor;
  }

  /**
   * @param {HTMLAnchorElement} selected
   */
  changeSelectedMarker(selected) {
    // Swap eye icon marking selected color with colorized bullet.
    selected.classList.add(this.options.selectedMarkerClass);
    const svg = selected.querySelector('svg');
    const circle = createIcon('mdi-circle');
    Object.assign(circle.style, {
      color: svg.style.fill,
      fontSize: '8px'
    });
    selected.appendChild(circle);
  }

  /**
   * @param {Jodit} jodit
   */
  init({ events }) {
    events.on('getIcon', getMdiIcon);
  }

  /**
   * @param {Jodit} jodit
   */
  beforeDestruct(jodit) {
    jodit.events.off('getIcon', getMdiIcon);
  }
}

/**
 * @param {HTMLElement} popup
 * @param {Object} options
 * @param {String} options.defaultTab
 * @returns {ColorPickers}
 */
function getColorPickers(popup, { defaultTab }) {
  const pickers = Array.from(popup.querySelectorAll(JODIT_COLORPICKER));
  if (pickers.length <= 0) return pickers;
  let textColor, backgroundColor, borderColor;
  if (defaultTab === 'background') {
    [backgroundColor, textColor, borderColor] = pickers;
  } else if (defaultTab === 'color') {
    [textColor, backgroundColor, borderColor] = pickers;
  }
  return Object.assign(pickers, {
    textColor,
    backgroundColor,
    borderColor
  });
}

/**
 * @param {Events} events
 * @param {Object} target
 * @param {EventListener} listener
 */
function onSelect(events, target, listener) {
  return events.on(target, JODIT_PICKER_SELECTION_EVENTS.join(' '), listener);
}

/**
 * @param {Jodit} jodit
 * @param {Object} target
 * @param {String} events
 * @param {EventListener} listener
 * @param {EventListener} oldListener
 */
function replaceListener(jodit, target, events, listener, oldListener) {
  jodit.events
    .off(target, events, oldListener)
    .on(target, events, listener);
}

/**
 * @param {Object} options
 * @param {String} options.icon
 * @param {String} options.text
 * @param {Number} [options.tabIndex=0]
 * @returns {HTMLSpanElement}
 */
export function createButton({ icon, text, tabIndex = 0 }) {
  const btn = document.createElement('span');
  btn.tabIndex = tabIndex;
  btn.setAttribute('role', 'button');
  btn.appendChild(createIcon(icon));
  btn.innerHTML += text;
  return btn;
}

/**
 * @param {String} name
 * @returns {HTMLSpanElement}
 */
export function createIcon(name) {
  const icon = document.createElement('span');
  icon.classList.add('jodit_icon', 'mdi', name);
  return icon;
}
