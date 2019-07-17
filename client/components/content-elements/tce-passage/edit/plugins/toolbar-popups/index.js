const JODIT_POPUP_ARROW = '.jodit_popup_triangle';

const isToolbarButton = el => el.classList.contains('jodit_toolbar_btn');

export const name = 'ToolbarPopups';

export const install = (Jodit, { popupOpenClass = 'popup_open' }) => {
  Jodit.plugins[name] = editor => {
    editor.events
      .on('beforeOpenPopup', togglePopup)
      .on('beforeDestruct', () => {
        if (!editor.events) return;
        editor.events.off('beforeOpenPopup', togglePopup);
      });

    function togglePopup(popup) {
      if (!isToolbarButton(popup.target)) return;
      // Close popup if it is already opened.
      if (popup.target.classList.contains(popupOpenClass)) {
        once(popup.target, 'click', () => popup.close());
      }
      const { calcPosition, doClose } = popup;
      popup.container.style.display = 'none';
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
        popup.target.classList.remove(popupOpenClass);
      };
    }
  };
};

export default install;

function once(el, event, listener) {
  el.addEventListener(event, function wrappedListener() {
    const result = listener.apply(this, arguments);
    el.removeEventListener(event, wrappedListener);
    return result;
  });
}
