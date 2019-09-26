import cuid from 'cuid';
import isFunction from 'lodash/isFunction';
import Jodit from 'Jodit';

const ENTER_KEY_CODE = 13;
const TOOLTIP_CONTROL = 'tooltip';
const TOOLTIP_ATTRIBUTE = 'data-tooltip';
const JODIT_FORM_CLASS = 'jodit_form';

export default {
  [TOOLTIP_CONTROL]: {
    popup: (editor, _, __, close) => {
      const node = resolveTooltipNode(editor);
      if (node) return createTooltipWidget(editor, node, close);
    }
  }
};

function resolveTooltipNode(editor) {
  const { editor: root, selection: { sel, range } } = editor;
  const { startContainer, endContainer, commonAncestorContainer: parent } = range;
  if (isTooltipNode(startContainer)) return startContainer;
  if (isTooltipNode(endContainer)) return endContainer;
  return resolveWithinRangeParent(parent, sel) ||
    resolveOutsideRangeParent(root, parent) ||
    createTooltipNode(editor);
}

function resolveWithinRangeParent(parent, sel, options = {}) {
  const { tagName = 'span', partialContainment = true } = options;
  if (!isFunction(parent.getElementsByTagName)) return null;
  const collection = parent.getElementsByTagName(tagName);
  return Array.from(collection).find(node => {
    return sel.containsNode(node, partialContainment) &&
      isTooltipNode(node);
  });
}

function resolveOutsideRangeParent(root, node = {}) {
  if ([root, document].includes(node)) return null;
  if (isTooltipNode(node)) return node;
  const { parentNode: parent } = node;
  return resolveOutsideRangeParent(root, parent);
}

function createTooltipNode(editor, { tagName = 'span' } = {}) {
  const { selection: { sel } } = editor;
  const id = cuid();
  const html =
    `<${tagName} id="${id}" ${TOOLTIP_ATTRIBUTE}="">` +
      `${sel}` +
    `</${tagName}>`;
  editor.execCommand('insertHtml', false, html);
  return document.getElementById(`${id}`);
}

function isTooltipNode(node = {}) {
  if (!isFunction(node.hasAttribute)) return false;
  return node.hasAttribute(TOOLTIP_ATTRIBUTE);
}

function createTooltipWidget(editor, node, close) {
  const form = createTooltipForm(editor, node);
  setupSubmissionHandler(editor, form, node, close);
  setupDeletionHandler(editor, form, node, close);
  setupEnterKeyDownHandler(form);
  const tabs = { tooltip: form };
  return new Jodit.modules.Widget.TabsWidget(editor, tabs);
}

function createTooltipForm(editor, node) {
  const tooltip = node.getAttribute(TOOLTIP_ATTRIBUTE);
  return editor.create.fromHTML(
    `<form onsubmit="return false;" class="${JODIT_FORM_CLASS}">
      <textarea name="tooltip">${tooltip}</textarea>
      <div style="text-align: right">
        <button name="delete" type="button">Delete</button>
        <button name="submit" type="submit">Save</button>
      </div>
    </form>`
  );
}

function setupSubmissionHandler(editor, form, node, close) {
  form.addEventListener('submit', event => {
    event.preventDefault();
    event.stopPropagation();
    const { value: tooltip } = form.querySelector(`textarea[name="tooltip"]`);
    tooltip
      ? node.setAttribute(TOOLTIP_ATTRIBUTE, tooltip)
      : removeTooltipNode(editor, node);
    close();
  }, { once: true });
}

function setupDeletionHandler(editor, form, node, close) {
  const deleteButton = form.querySelector(`button[name="delete"]`);
  deleteButton.addEventListener('click', () => {
    removeTooltipNode(editor, node);
    close();
  }, { once: true });
}

function setupEnterKeyDownHandler(form) {
  const textArea = form.querySelector(`textarea[name="tooltip"]`);
  textArea.addEventListener('keydown', event => {
    if (event.keyCode !== ENTER_KEY_CODE) return;
    event.stopPropagation();
  });
}

function removeTooltipNode(editor, node = {}) {
  const docFrag = document.createDocumentFragment();
  while (node.firstChild) {
    const child = node.removeChild(node.firstChild);
    docFrag.appendChild(child);
  }
  if (node.parentNode) node.parentNode.replaceChild(docFrag, node);
}
