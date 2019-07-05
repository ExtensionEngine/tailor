const JODIT_TOOLBAR_BREAK = '\n';
const EXCLUDED_ITEMS = [JODIT_TOOLBAR_BREAK, 'fullsize'];

const ICONS = {
  source: 'code-tags',
  bold: 'format-bold',
  strikethrough: 'format-strikethrough',
  underline: 'format-underline',
  italic: 'format-italic',
  superscript: 'format-superscript',
  subscript: 'format-subscript',
  ul: 'format-list-bulleted',
  ol: 'format-list-numbered',
  outdent: 'format-indent-decrease',
  indent: 'format-indent-increase',
  font: 'format-font',
  fontsize: 'format-size',
  brush: 'water',
  paragraph: 'format-pilcrow',
  image: 'image-plus',
  file: 'file-plus',
  video: 'video-plus',
  table: 'table-plus',
  link: 'link',
  /* align */ ...{
    left: 'format-align-left',
    center: 'format-align-center',
    right: 'format-align-right',
    justify: 'format-align-justify'
  },
  undo: 'undo',
  redo: 'redo',
  cut: 'content-cut',
  hr: 'minus',
  eraser: 'eraser',
  copyformat: 'format-paint',
  /* symbol */ omega: 'omega',
  // NOTE: `fullsize` icon can NOT be changed!
  // fullsize: 'arrow-expand-all',
  /* selectall */ 'select-all': 'select-all',
  print: 'printer',
  dots: 'dots-vertical',
  cancel: 'close',
  // popup toolbar icons
  valign: 'format-align-top',
  splitv: 'format-columns',
  merge: 'table-merge-cells',
  addcolumn: 'table-column-plus-after',
  addrow: 'table-row-plus-after',
  bin: 'trash-can'
};

const isString = arg => typeof arg === 'string';
const splitArray = arg => isString(arg) ? arg.split(/[,\s]+/) : arg;

export function getIcon(name) {
  const code = ICONS[name];
  return `<span class="passage-icon mdi mdi-${code}"></span>`;
}

export function renderToolbar(jodit) {
  const buttons = splitArray(jodit.options.buttons)
    .concat(jodit.options.extraButtons)
    .filter(it => !EXCLUDED_ITEMS.includes(it));
  const toolbar = document.getElementById('joditToolbar');
  console.log(buttons);
  return jodit.toolbar.build(buttons, toolbar);
}
