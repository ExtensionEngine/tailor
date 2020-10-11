'use strict';

const cheerio = require('cheerio');
const fs = require('fs');
const map = require('lodash/map');
const mapKeys = require('lodash/mapKeys');
const mjml2html = require('mjml');
const mustache = require('mustache');
const { paramCase } = require('change-case');

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
  /*
   * Mustache render needs to happen before `mjml2html` since it messes
   * up mustache list rendering. Additional `mustache.render` is needed to
   * account for imported .mjml files.
   */
  const mustacheOutput = mustache.render($.html(), data);
  const output = mjml2html(mustacheOutput, opts).html;
  return mustache.render(output, data);
}

function renderText(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf8');
  return mustache.render(template, data);
}

function getAttributes($, style = {}) {
  return map(style, (declarations, name) => $('<mj-class>').attr({
    name,
    ...mapKeys(declarations, (_, key) => paramCase(key))
  }));
}
