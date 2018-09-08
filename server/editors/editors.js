'use strict';

const find = require('lodash/find');
const remove = require('lodash/remove');

class Editors {
  constructor() {
    this.editors = [];
  }

  has(editor) {
    return !!find(this.editors, editor);
  }

  add(editor) {
    if (this.has(editor)) return;
    this.editors.push(editor);
  }

  delete(editorToRemove) {
    remove(this.editors, editor => editor.id === editorToRemove.id);
  }

  values() {
    return this.editors;
  }
}

module.exports = Editors;
