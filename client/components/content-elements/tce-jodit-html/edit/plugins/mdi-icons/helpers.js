/**
 * @param {HTMLElement} el
 * @param {String} selector
 * @returns {HTMLElement}
 */
export function parent(el, selector) {
  while (el && !el.matches(selector)) {
    el = el.parentElement;
  }
  return el;
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
