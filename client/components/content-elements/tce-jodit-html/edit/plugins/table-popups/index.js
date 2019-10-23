import autoBind from 'auto-bind';
import scrollparent from 'scrollparent';

const JODIT_RECALC_POPUP_POSITION_EVENT = 'recalcPositionPopup';
const JODIT_DEFAULT_EVENT_NAMESPACE = 'JoditEventDefaultNamespace';

/** @typedef {import('jodit').IJodit} Jodit */

export default class TablePopupsPlugin {
  static get pluginName() {
    return 'table-popups';
  }

  constructor() {
    autoBind(this);
  }

  /**
   * @param {Jodit} jodit
   */
  init(jodit) {
    const self = this;
    const { afterInitHook } = jodit;
    jodit.afterInitHook = function () {
      afterInitHook.apply(this, arguments);
      self.observeTables(jodit);
      self.scrollContainer = scrollparent(jodit.container);
      if (self.scrollContainer) self.addScrollHandler(jodit);
    };
  }

  /**
   * @param {Jodit} jodit
   */
  observeTables(jodit) {
    const { constructor: Jodit } = jodit;
    const { table } = jodit.__plugins;
    const { $$: query } = Jodit.modules.Helpers;
    query('table', jodit.editor).forEach(tableEl => {
      if (table[table.__key]) return;
      table.observe(tableEl);
    });
  }

  /**
   * @param {Jodit} jodit
   */
  addScrollHandler(jodit) {
    const [eventDesc] = jodit.events.getStore(jodit.events)
      .get(JODIT_RECALC_POPUP_POSITION_EVENT, JODIT_DEFAULT_EVENT_NAMESPACE);

    const recalcPopupPosition = eventDesc && eventDesc.originalCallback;
    if (!recalcPopupPosition) return;

    this.scrollHandler = this.createScrollHandler(recalcPopupPosition);
    jodit.events.on(this.scrollContainer, 'scroll', this.scrollHandler);
  }

  /**
   * @param {Function} recalcPopupPosition
   */
  createScrollHandler(recalcPopupPosition) {
    return scrollHandler.bind(this);
    function scrollHandler() {
      const { inlinePopup } = this.jodit.__plugins;
      if (!inlinePopup || !inlinePopup.isShown) return;
      return recalcPopupPosition.call(inlinePopup);
    }
  }

  /**
   * @param {Jodit} jodit
   */
  beforeDestruct(jodit) {
    if (this.scrollContainer && this.scrollHandler) {
      jodit.events.off(this.scrollContainer, 'scroll', this.scrollHandler);
    }
  }
}
