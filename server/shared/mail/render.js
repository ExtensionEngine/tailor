'use strict';

const { paramCase } = require('change-case');
const cheerio = require('cheerio');
const fs = require('fs');
const map = require('lodash/map');
const mapKeys = require('lodash/mapKeys');
const mjml2html = require('mjml');
const pupa = require('pupa');

module.exports = {
  renderHtml,
  renderText
};

function renderHtml(templatePath, data, style) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const $ = cheerio.load(template, { xmlMode: true });
  const $style = $('mj-attributes');
  $style.append(getAttributes($, style));
  const opts = { filePath: templatePath, minify: true };
  const output = mjml2html($.html(), opts).html;
  return pupa(output, data);
}

function renderText(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf8');
  return pupa(template, data);
}

function getAttributes($, style = {}) {
  return map(style, (declarations, name) => $('<mj-class>').attr({
    name,
    ...mapKeys(declarations, (_, key) => paramCase(key))
  }));
}
