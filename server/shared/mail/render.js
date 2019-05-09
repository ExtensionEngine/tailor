'use strict';

const { paramCase } = require('change-case');
const cheerio = require('cheerio');
const createDataUri = require('create-data-uri');
const fileType = require('file-type');
const fs = require('fs');
const logger = require('../logger');
const mapKeys = require('lodash/mapKeys');
const map = require('lodash/map');
const mjml2html = require('mjml');
const path = require('path');
const mustache = require('mustache');

module.exports = {
  renderHtml,
  renderText
};

function renderHtml(templatePath, data, style) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const $ = cheerio.load(template, { xmlMode: true });
  const $style = $('mj-attributes');
  $style.append(getAttributes($, style));
  logger.debug({ style: dump($, $style) }, 'Style email using `mj-attributes`:');
  $('img[src]').each((_, el) => {
    const $image = $(el);
    const imagePath = $image.attr('src');
    $image.attr('src', getDataUri(imagePath));
  });
  const output = mjml2html($.html(), { minify: true }).html;
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

function getDataUri(imagePath) {
  const buf = fs.readFileSync(path.join(__dirname, './templates/', imagePath));
  const { mime } = fileType(buf) || {};
  return createDataUri(mime, buf.toString('base64'));
}

function dump($, $style) {
  return $style.find('mj-class').get().reduce((acc, el) => {
    const { name, ...attrs } = $(el).attr();
    return Object.assign(acc, { [name]: attrs });
  }, {});
}
