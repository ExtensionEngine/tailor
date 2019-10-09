const JODIT_DEFAULT_EVENT_NAMESPACE = 'JoditEventDefaultNamespace';
const JODIT_POPUP_ARROW = '.jodit_popup_triangle';
const JODIT_POPUP_TRIGGER_EVENTS = ['mousedown', 'touchend'];
const JODIT_TOOLBAR_BUTTON = '.jodit_toolbar_btn';

const isToolbarButton = el => el.matches(JODIT_TOOLBAR_BUTTON);

export const name = 'ToolbarPopups';

export const install = (Jodit, { popupOpenClass = 'popup_open' } = {}) => {
  const popups = new Map();
  const toggle = Symbol('toggle');

  Jodit.plugins[name] = editor => {
    const { events } = editor;
    events
      .on('beforeOpenPopup', onPopupOpen)
      .on('beforeDestruct', () => {
        if (events) events.off('beforeOpenPopup', onPopupOpen);
      });

    function onPopupOpen(popup) {
      if (!isToolbarButton(popup.target)) return;
      popup.container.style.display = 'none';
      popups.set(popup.target, popup);

      const { calcPosition, doClose } = popup;
      popup.calcPosition = () => {
        calcPosition.call(popup);
        popup.target.classList.add(popupOpenClass);
        const arrow = popup.container.querySelector(JODIT_POPUP_ARROW);
        if (arrow) arrow.style.marginLeft = 0;
        Object.assign(popup.container.style, {
          marginLeft: 0,
          display: 'initial'
        });
      };
      popup.doClose = () => {
        doClose.call(popup);
        popups.delete(popup.target, popup);
        popup.target.classList.remove(popupOpenClass);
      };

      const [eventDesc] = events.getStore(popup.target)
        .get(JODIT_POPUP_TRIGGER_EVENTS[0], JODIT_DEFAULT_EVENT_NAMESPACE);
      const listener = eventDesc && eventDesc.originalCallback;
      if (!listener || listener[toggle]) return;
      replaceListener(
        editor,
        popup.target,
        JODIT_POPUP_TRIGGER_EVENTS.join(' '),
        wrapListener(popup.target, listener),
        listener
      );
    }
  };

  function replaceListener(editor, target, events, listener, oldListener) {
    editor.events
      .off(target, events, oldListener)
      .on(target, events, listener);
  }

  function wrapListener(target, listener) {
    return Object.assign(togglePopup, { [toggle]: true });
    function togglePopup() {
      const popup = popups.get(target);
      if (popup && popup.isOpened) {
        popup.close();
        return;
      }
      return listener.apply(this, arguments);
    }
  }
};

export default install;
