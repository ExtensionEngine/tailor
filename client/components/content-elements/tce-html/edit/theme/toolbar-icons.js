const isString = arg => typeof arg === 'string';

const mdiIcons = {
  undo: 'undo',
  redo: 'redo',
  align: {
    '': 'format-align-left',
    center: 'format-align-center',
    right: 'format-align-right',
    justify: 'format-align-justify'
  },
  background: 'format-color-highlight',
  blockquote: 'format-quote-close',
  bold: 'format-bold',
  clean: 'format-clear',
  code: 'code-tags',
  'code-block': 'code-tags',
  color: 'format-color-text',
  direction: {
    '': 'format-textdirection-l-to-r',
    rtl: 'format-textdirection-r-to-l'
  },
  formula: 'function-variant',
  header: {
    1: 'format-header-1',
    2: 'format-header-2'
  },
  italic: 'format-italic',
  image: 'image-plus',
  indent: {
    '+1': 'format-indent-increase',
    '-1': 'format-indent-decrease'
  },
  link: 'link',
  list: {
    bullet: 'format-list-bulleted',
    check: 'format-list-checks',
    ordered: 'format-list-numbered'
  },
  script: {
    sub: 'format-subscript',
    super: 'format-superscript'
  },
  strike: 'format-strikethrough',
  table: 'table-plus',
  underline: 'format-underline',
  video: 'video-plus'
};

export default mdiIcons;

const textColor = `
  <span style="position: relative;">
    <span class="icon mdi mdi-format-color-text" style="position: absolute;"></span>
    <span class="icon mdi mdi-color-helper" style="position: absolute;"></span>
  </span>`;

export function getMdiIcon(name, value) {
  if (name === 'color') return textColor;
  const icon = mdiIcons[name];
  const code = isString(icon) ? icon : icon[value];
  return `<span class="icon mdi mdi-${code}"></span>`;
}
