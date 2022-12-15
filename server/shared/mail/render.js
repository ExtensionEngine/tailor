import cheerio from 'cheerio';
import fs from 'fs';
import { html } from './formatters.js';
import map from 'lodash/map.js';
import mapKeys from 'lodash/mapKeys.js';
import mjml2html from 'mjml';
import mustache from 'mustache';
import { paramCase } from 'change-case';

export {
  renderHtml,
  renderText
};

function renderHtml(templatePath, data, style) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const $ = cheerio.load(template, { xmlMode: true });
  const $style = $('mj-attributes');
  $style.append(getAttributes($, style));
  const opts = { filePath: templatePath, minify: true };
  const mustacheOutput = mustache.render($.html(), data);
  const output = mjml2html(mustacheOutput, opts).html;
  // NOTE: Additional `mustache.render` call handles mustache syntax within mjml
  // subcomponents. Subcomponents' mustache syntax is removed by `mjml2html` if
  // placed outside of tag attribute or mj-text tag.
  return mustache.render(output, data);
}

function renderText(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf8');
  return mustache.render(template, { ...data, html });
}

function getAttributes($, style = {}) {
  return map(style, (declarations, name) => $('<mj-class>').attr({
    name,
    ...mapKeys(declarations, (_, key) => paramCase(key))
  }));
}
