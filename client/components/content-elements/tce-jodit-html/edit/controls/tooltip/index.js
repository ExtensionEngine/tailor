import isFunction from 'lodash/isFunction';
import Jodit from 'jodit';

const TOOLTIP_CONTROL = 'tooltip';
const TOOLTIP_TAG = 'span';
const TOOLTIP_ATTR = 'data-tooltip';
const TOOLTIP_CLASS = 'tce-jodit-tooltip';

const isTooltipNode = node => {
  if (!node || !isFunction(node.hasAttribute)) return false;
  return node.hasAttribute(TOOLTIP_ATTR);
};

export default {
  [TOOLTIP_CONTROL]: {
    popup: (editor, current, self, close) => {
      const { sel } = editor.selection;
      const { val } = Jodit.modules.Helpers;
      const form = editor.create.fromHTML(
        `<form class="jodit_form">
          <textarea name="tooltip" placeholder="Tooltip"></textarea>
          <input name="text" type="text" placeholder="Text">
          <div style="text-align: right">
            <button name="delete" type="button">Delete</button>
            <button name="submit" type="submit">Submit</button>
          </div>
        </form>`
      );

      const deleteButton = form.querySelector('button[name=delete]');
      current = Jodit.modules.Dom.up(current, isTooltipNode, editor.editor);
      if (current) {
        const tooltipValue = current.getAttribute(TOOLTIP_ATTR) || '';
        val(form, 'textarea[name=tooltip]', tooltipValue);
        val(form, 'input[name=text]', current.innerText);
      } else {
        val(form, 'input[name=text]', sel ? sel.toString() : '');
        deleteButton.style.display = 'none';
      }

      const selInfo = editor.selection.save();

      form.addEventListener('submit', event => {
        event.preventDefault();
        editor.selection.restore(selInfo);
        const tooltipElement = current || document.createElement(TOOLTIP_TAG);
        const tooltipValue = val(form, 'textarea[name=tooltip]');
        const innerText = val(form, 'input[name=text]');
        tooltipElement.setAttribute(TOOLTIP_ATTR, tooltipValue);
        tooltipElement.classList.add(TOOLTIP_CLASS);
        tooltipElement.innerText = innerText;
        if (!current && innerText) editor.selection.insertNode(tooltipElement);
        close();
      });

      deleteButton.addEventListener('click', event => {
        event.preventDefault();
        if (current) Jodit.modules.Dom.unwrap(current);
        editor.selection.restore(selInfo);
        close();
      });

      return form;
    }
  }
};
