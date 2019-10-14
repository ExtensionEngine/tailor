import autoBind from 'auto-bind';

const JODIT_DEFAULT_EVENT_NAMESPACE = 'JoditEventDefaultNamespace';
const JODIT_POPUP_ARROW = '.jodit_popup_triangle';
const JODIT_POPUP_TRIGGER_EVENTS = ['mousedown', 'touchend'];
const JODIT_TOOLBAR_BUTTON = '.jodit_toolbar_btn';

const toggle = Symbol('toggle');

const hide = el => (el.style.display = 'none');
const isToolbarButton = el => el.matches(JODIT_TOOLBAR_BUTTON);

/** @typedef {import('jodit/src/Config').Config & import('jodit/src/plugins')} Config */
/** @typedef {import('jodit').IJodit} Jodit */
/** @typedef {import('jodit').IComponent} Component */

export default class ToolbarPopupsPlugin {
  static get pluginName() {
    return 'toolbar-popups';
  }

  constructor(options) {
    options.popupOpenClass = options.popupOpenClass || 'popup_open';
    autoBind(this);
    this.popups = new Map();
  }

  /**
   * @param {Jodit} jodit
   */
  init(jodit) {
    jodit.events.on('beforeOpenPopup', this.beforeOpenPopup);
  }

  /**
   * @param {Component} popup
   */
  beforeOpenPopup(popup) {
    const self = this;

    if (!isToolbarButton(popup.target)) return;

    hide(popup.container);
    this.popups.set(popup.target, popup);

    const { calcPosition, doClose } = popup;
    popup.calcPosition = function () {
      calcPosition.apply(this, arguments);
      self.onOpenPopup(popup);
    };
    popup.doClose = function () {
      doClose.apply(this, arguments);
      self.onClosePopup(popup);
    };

    const [eventDesc] = this.jodit.events.getStore(popup.target)
      .get(JODIT_POPUP_TRIGGER_EVENTS[0], JODIT_DEFAULT_EVENT_NAMESPACE);
    const oldListener = eventDesc && eventDesc.originalCallback;
    if (!oldListener || oldListener[toggle]) return;

    replaceListener(
      this.jodit,
      popup.target,
      JODIT_POPUP_TRIGGER_EVENTS.join(' '),
      this.createToggleAction(popup.target, oldListener),
      oldListener
    );
  }

  /**
   * @param {Component} popup
   */
  onOpenPopup(popup) {
    popup.target.classList.add(this.options.popupOpenClass);
    const arrow = popup.container.querySelector(JODIT_POPUP_ARROW);
    if (arrow) arrow.style.marginLeft = 0;
    Object.assign(popup.container.style, {
      marginLeft: 0,
      display: 'initial'
    });
  }

  /**
   * @param {Component} popup
   */
  onClosePopup(popup) {
    this.popups.delete(popup.target, popup);
    popup.target.classList.remove(this.options.popupOpenClass);
  }

  /**
   * @param {Object} target
   * @param {EventListener} listener
   * @returns {EventListener}
   */
  createToggleAction(target, listener) {
    const self = this;
    return Object.assign(togglePopup, { [toggle]: true });
    function togglePopup() {
      const popup = self.popups.get(target);
      if (popup && popup.isOpened) {
        popup.close();
        return;
      }
      return listener.apply(this, arguments);
    }
  }

  /**
   * @param {Jodit} jodit
   */
  beforeDestruct(jodit) {
    jodit.events.off('beforeOpenPopup', this.beforeOpenPopup);
  }
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
