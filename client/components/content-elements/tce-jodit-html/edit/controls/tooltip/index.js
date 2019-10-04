import Jodit from 'Jodit';

const TOOLTIP_CONTROL = 'tooltip';
const TOOLTIP_TAG_NAME = 'tooltip-element';
const TOOLTIP_ATTRIBUTE = 'data-tooltip';
const TOOLTIP_CLASS = 'tce-jodit-tooltip';

class TooltipElement extends HTMLElement {}
customElements.define(TOOLTIP_TAG_NAME, TooltipElement);

export default {
  [TOOLTIP_CONTROL]: {
    popup: (editor, current, self, close) => {
      const { sel } = editor.selection;
      const { val } = Jodit.modules.Helpers;
      const form = editor.create.fromHTML(
        `<form class="jodit_form">
          <textarea name="tooltip"></textarea>
          <input name="text" type="text">
          <div style="text-align: right">
            <button name="delete" type="button">Delete</button>
            <button name="submit" type="submit">Submit</button>
          </div>
        </form>`
      );

      const args = [current, TOOLTIP_TAG_NAME, editor.editor];
      current = (current && Jodit.modules.Dom.closest(...args)) || false;
      if (current) {
        const tooltipValue = current.getAttribute(TOOLTIP_ATTRIBUTE) || '';
        val(form, 'textarea[name=tooltip]', tooltipValue);
        val(form, 'input[name=text]', current.innerText);
      } else {
        val(form, 'input[name=text]', sel ? sel.toString() : '');
      }

      const selInfo = editor.selection.save();

      form.addEventListener('submit', event => {
        event.preventDefault();
        editor.selection.restore(selInfo);
        const tooltipElement = current || new TooltipElement();
        const tooltipValue = val(form, 'textarea[name=tooltip]');
        const innerText = val(form, 'input[name=text]');
        tooltipElement.setAttribute(TOOLTIP_ATTRIBUTE, tooltipValue);
        tooltipElement.classList.add(TOOLTIP_CLASS);
        tooltipElement.innerText = innerText;
        if (!current && innerText) editor.selection.insertNode(tooltipElement);
        close();
      });

      const deleteButton = form.querySelector('button[name=delete]');
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
