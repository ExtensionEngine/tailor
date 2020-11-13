'use strict';

const htmlToText = require('html-to-text');

function html() {
  return (text, render) => htmlToText.fromString(render(text));
}

module.exports = { html };
